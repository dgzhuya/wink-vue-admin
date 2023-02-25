import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { UpdatePluginDto } from './dto/update-plugin.dto'
import { Plugin } from './entities/plugin.entity'
import { isNotNull } from '@/common/utils/isNotNull'
import { writeFileSync, existsSync, mkdirSync, readFileSync, renameSync } from 'fs'
import { join } from 'path'
import {
	nodeParser,
	analyse,
	getModuleName,
	getModuleDescription,
	getRouterInfo,
	translate,
	getModuleComment,
	clearModule
} from '@biuxiu/compile'
import { BadParamsException } from '@/common/exception/bad-params-exception'
import { DefaultPluginInfo } from '@/config/plugin'
import { exec } from 'child_process'
import * as WebSocket from 'ws'
import { BuildErrorException } from '@/common/exception/build-error-exception'
import { ASTNode } from '../../../compile/src/parser/ast/ASTNode'
import { PermissionService } from '@/permission/permission.service'
import { RouterConfig } from '../../../compile/src/gen/util/getInfoByAST'
import { Permission } from '@/permission/entities/permission.entity'

@Injectable()
export class PluginService {
	private readonly formatPath: string
	private readonly staticDir: string

	constructor(
		@InjectRepository(Plugin) private readonly pluginRepository: Repository<Plugin>,
		private readonly permissionService: PermissionService
	) {
		this.formatPath = join(__dirname, '../../../../', 'script/format.mjs')

		// 查看是否存在static目录
		const staticDir = join(process.cwd(), 'static')
		if (!existsSync(staticDir)) mkdirSync(staticDir)
	}

	/**
	 * 通过文件上传设置插件信息
	 * @param file 文件信息
	 */
	async create(file: Express.Multer.File) {
		const { originalname, buffer } = file
		// 检查文件是否存存在
		if (existsSync(join(this.staticDir, originalname))) throw new BadParamsException('40026')

		// 解析文件字符串信息为token数组
		const { data, error } = analyse(buffer.toString())
		if (error) throw new BadParamsException('40019')
		// 将token数组解析为虚拟节点树
		const astNode = await nodeParser(data)

		// 获取插件名称
		const pluginName = getModuleName(astNode)
		// 检查插件名称是否已经被使用过
		const pluginNameCount = await this.pluginRepository.countBy({ key: pluginName })
		if (DefaultPluginInfo.pluginNames.includes(pluginName) || pluginNameCount > 0)
			throw new BadParamsException('40021')
		// 获取插件描述的路由信息
		const routerInfo = getRouterInfo(astNode)
		const routeName = routerInfo.name
		// 检查路由名是否冲突
		const routeNameCount = await this.pluginRepository.countBy({ routeName })
		if (DefaultPluginInfo.routeNames.includes(routeName) || routeNameCount > 0)
			throw new BadParamsException('40022')

		// 获取路由地址信息
		const routePath = `/${routerInfo.parentPath}/${routerInfo.path}`
		// 检查路由地址是否冲突
		const routerPathCount = await this.pluginRepository.countBy({ routePath })
		if (DefaultPluginInfo.routePaths.includes(routePath) || routerPathCount > 0)
			throw new BadParamsException('40020')

		// 获取模块描述
		const description = getModuleDescription(astNode)
		// 获取模块名称
		const comment = getModuleComment(astNode)
		// 检查当前路由权限是否存在
		if (await this.permissionService.hasPermissionByKey(routerInfo.name)) throw new BadParamsException('40023')

		let parentPermission: Permission
		// 如果不存在父级权限则添加父级权限
		if (routerInfo.parentName && !(await this.permissionService.hasPermissionByKey(routerInfo.parentName))) {
			parentPermission = await this.permissionService.create({
				key: routerInfo.parentName,
				title: routerInfo.parentTitle
			})
		} else {
			parentPermission = await this.permissionService.findOneByKey(routerInfo.parentName)
		}
		// 插入上级路由信息
		const { id } = await this.permissionService.create({
			title: comment,
			description,
			key: routerInfo.name
		})
		if (parentPermission) {
			await this.permissionService.update(id, { hasChildren: true, parentId: parentPermission.id })
			if (!parentPermission.hasChildren) await this.permissionService.updateHasChildren(parentPermission.id, true)
		} else {
			await this.permissionService.updateHasChildren(id, true)
		}
		// 批量添加路由子权限信息
		await Promise.all(this.genChildrenPermission(id, comment, description, routerInfo))
		// 写入文件服务器中
		writeFileSync(join(this.staticDir, originalname), buffer)
		await this.pluginRepository.save({
			routeName,
			routePath,
			name: comment,
			key: pluginName,
			description,
			url: originalname
		})
		return this.execPluginFile(astNode)
	}

	/**
	 * 列表查询插件信息
	 * @param skip 起始位置
	 * @param take 查询数量
	 * @param search 搜索条件
	 */
	async findAll(skip: number, take: number, search?: string) {
		if (isNotNull(skip) && isNotNull(take)) {
			let queryBuilder = this.pluginRepository.createQueryBuilder('plugin')
			if (search) {
				queryBuilder = queryBuilder
					.where('plugin.name like :search', { search: `%${search}%` })
					.orWhere('plugin.key like :search', { search: `%${search}%` })
					.orWhere('plugin.description like :search', { search: `%${search}%` })
			}
			const [list, total] = await queryBuilder.skip(skip).take(take).getManyAndCount()
			return {
				list,
				total
			}
		}
		await this.pluginRepository.find()
	}

	/**
	 * 获取插件详情
	 * @param id 插件ID
	 */
	findOne(id: number) {
		return this.pluginRepository.findOneBy({ id })
	}

	/**
	 * 更新插件信息
	 * @param id 插件ID
	 * @param updatePluginDto 插件更新信息
	 */
	update(id: number, updatePluginDto: UpdatePluginDto) {
		const pluginDto: any = {}
		const { name, description } = updatePluginDto
		if (name) pluginDto.name = name
		if (description) pluginDto.description = description
		return this.pluginRepository.update(id, pluginDto)
	}

	/**
	 * 删除插件信息
	 * @param rid 插件id
	 */
	async remove(rid: number) {
		const pluginInfo = await this.pluginRepository.findOneBy({ id: rid })
		if (!pluginInfo) throw new BadParamsException('40024')

		// 获取文件地址
		const filePath = join(process.cwd(), 'static', pluginInfo.url)
		// 解析文件为token流
		const { data, error } = analyse(readFileSync(filePath).toString())
		if (error) throw new BadParamsException('40019')
		// 解析token流为AST树
		const astNode = await nodeParser(data)

		// 获取当前插件权限信息
		const currentPermission = await this.permissionService.findOneByKey(pluginInfo.routeName)
		if (!currentPermission) throw new BadParamsException('40025')

		// 获取当前插件子权限信息
		const childrenPermission = await this.permissionService.getPermissionByParent(currentPermission.id)
		if (!childrenPermission) throw new BadParamsException('40025')

		// 获取所需要删除的所有权限ID
		const permissionIds = [...childrenPermission.map(p => p.id), currentPermission.id]
		// 批量删除角色关联的权限信息
		await this.permissionService.removeRolePermissionByIds(permissionIds)
		// 批量删除当前插件子权限信息
		await this.permissionService.deletePermissionByParentId(currentPermission.id)
		// 删除当前权限信息
		await this.permissionService.remove(currentPermission.id)
		if (currentPermission.parentId) {
			await this.permissionService.resetParentHasChildren(currentPermission.parentId)
		}
		await this.pluginRepository.softDelete(rid)
		renameSync(filePath, `${filePath}.bak`)
		try {
			clearModule(astNode)
		} catch (error) {
			throw new BuildErrorException('50003')
		}
		try {
			return await this.execFileBuild()
		} catch (e) {
			throw new BuildErrorException('50001')
		}
	}

	/**
	 * 生成子权限增数据
	 * @param pid 父级ID
	 * @param comment 指令标题
	 * @param description 指令描述
	 * @param routerInfo 路由信息
	 * @private
	 */
	private genChildrenPermission(pid: number, comment: string, description: string, routerInfo: RouterConfig) {
		return [
			['添加', 'add'],
			['修改', 'update'],
			['删除', 'delete']
		].map(([typeComment, typeKey]) =>
			this.permissionService.create({
				title: `${typeComment}${comment}`,
				description: `${typeComment}${description}权限`,
				parentId: pid,
				key: `${routerInfo.parentPath}_${routerInfo.path}_${typeKey}`
			})
		)
	}

	/**
	 * 执行文件转换生成
	 * @param astNode 文件转换AST
	 * @private
	 */
	private async execPluginFile(astNode: ASTNode) {
		try {
			translate(astNode)
		} catch (error) {
			throw new BuildErrorException('50002')
		}
		try {
			return await this.execFileBuild()
		} catch (e) {
			throw new BuildErrorException('50001')
		}
	}

	/**
	 * 执行文件编译监听
	 * @private
	 */
	private execFileBuild() {
		let sendTimes = 0
		return new Promise((resolve, reject) => {
			exec(`node ${this.formatPath}`)
			if (process.env.NODE_ENV === 'production') {
				const codePath = Math.random().toString(36).slice(-6)
				const ws = new WebSocket('ws://localhost:9527/build')
				ws.on('open', () => {
					ws.send(JSON.stringify({ key: process.env.WS_KEY, codePath }))
				})

				ws.on('message', event => {
					const data = event.toString()
					if (data) {
						const result = JSON.parse(data)
						if (result.code === 200) {
							ws.close()
							resolve(codePath)
						} else {
							if (sendTimes < 3) {
								sendTimes += 1
								ws.send(JSON.stringify({ key: process.env.WS_KEY, codePath }))
							} else {
								reject()
							}
						}
					}
				})
			}
		})
	}
}
