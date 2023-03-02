import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UpdatePluginDto } from './dto/update-plugin.dto'
import { PluginEntity } from './entities/plugin.entity'
import { isNotNull } from '@/common/utils/isNotNull'
import { writeFileSync, existsSync, mkdirSync, readFileSync, renameSync } from 'fs'
import { join } from 'path'
import {
	ASTNode,
	RouterConfig,
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
import { PermissionService } from '@/permission/permission.service'
import { PermissionEntity } from '@/permission/entities/permission.entity'

@Injectable()
export class PluginService {
	private readonly formatPath: string
	private readonly staticDir: string

	constructor(
		private readonly permissionService: PermissionService,
		@InjectRepository(PluginEntity) private readonly pluginRepository: Repository<PluginEntity>
	) {
		this.formatPath = join(__dirname, '../../../../', 'script/format.mjs')

		// 查看是否存在static目录
		this.staticDir = join(process.cwd(), 'static')
		if (!existsSync(this.staticDir)) mkdirSync(this.staticDir)
	}

	/**
	 * 通过文件上传设置插件信息
	 * @param file 文件信息
	 */
	async create(file: Express.Multer.File) {
		const { originalname, buffer } = file
		if (existsSync(join(this.staticDir, originalname))) throw new BadParamsException('40026')

		const { data, error } = analyse(buffer.toString())
		if (error) throw new BadParamsException('40019')
		const astNode = await nodeParser(data)

		const pluginName = getModuleName(astNode)
		const pluginNameCount = await this.pluginRepository.countBy({ key: pluginName })
		if (DefaultPluginInfo.pluginNames.includes(pluginName) || pluginNameCount > 0)
			throw new BadParamsException('40021')

		const routerInfo = getRouterInfo(astNode)
		const routeName = routerInfo.name
		const routeNameCount = await this.pluginRepository.countBy({ routeName })
		if (DefaultPluginInfo.routeNames.includes(routeName) || routeNameCount > 0)
			throw new BadParamsException('40022')

		const routePath = `/${routerInfo.parentPath}/${routerInfo.path}`
		const routerPathCount = await this.pluginRepository.countBy({ routePath })
		if (DefaultPluginInfo.routePaths.includes(routePath) || routerPathCount > 0)
			throw new BadParamsException('40020')

		const description = getModuleDescription(astNode)
		const comment = getModuleComment(astNode)

		await this.pluginPermission(comment, description, routerInfo)

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
	async table(skip?: number, take?: number, search?: string) {
		if (skip === undefined || take === undefined) return this.pluginRepository.find()

		let queryBuilder = this.pluginRepository.createQueryBuilder('plugin')
		if (search) {
			queryBuilder = queryBuilder
				.where('plugin.name like :search', { search: `%${search}%` })
				.orWhere('plugin.key like :search', { search: `%${search}%` })
				.orWhere('plugin.description like :search', { search: `%${search}%` })
		}
		const [list, total] = await queryBuilder.skip(skip).take(take).getManyAndCount()
		return { list, total }
	}

	/**
	 * 获取插件详情
	 * @param id 插件ID
	 */
	query(id: number) {
		return this.pluginRepository.findOneBy({ id })
	}

	/**
	 * 更新插件信息
	 * @param id 插件ID
	 * @param updatePluginDto 插件更新信息
	 */
	update(id: number, updatePluginDto: UpdatePluginDto) {
		return this.pluginRepository.update(id, new UpdatePluginDto(updatePluginDto))
	}

	/**
	 * 删除插件信息
	 * @param rid 插件id
	 */
	async remove(rid: number) {
		const pluginInfo = await this.pluginRepository.findOneBy({ id: rid })
		if (!pluginInfo) throw new BadParamsException('40024')

		const filePath = join(process.cwd(), 'static', pluginInfo.url)
		const { data, error } = analyse(readFileSync(filePath).toString())
		if (error) throw new BadParamsException('40019')
		const astNode = await nodeParser(data)

		const permission = await this.permissionService.findOneByKey(pluginInfo.routeName)
		if (!permission) throw new BadParamsException('40025')

		await this.permissionService.deleteForce(permission.id)

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
	 * 插件权限功数据生成
	 * @param comment 插件名
	 * @param description 插件描述
	 * @param routerInfo 路由信息
	 * @private
	 */
	private async pluginPermission(comment: string, description: string, routerInfo: RouterConfig) {
		if (await this.permissionService.keyIsExited(routerInfo.name)) throw new BadParamsException('40023')
		let parentPermission: PermissionEntity
		if (routerInfo.parentName && !(await this.permissionService.keyIsExited(routerInfo.parentName))) {
			parentPermission = await this.permissionService.create({
				key: routerInfo.parentName,
				title: routerInfo.parentTitle
			})
		} else {
			parentPermission = await this.permissionService.findOneByKey(routerInfo.parentName)
		}
		const { id } = await this.permissionService.create({
			title: comment,
			description,
			key: routerInfo.name,
			parentId: parentPermission.id
		})
		await Promise.all(this.genChildrenPermission(id, comment, description, routerInfo))
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
