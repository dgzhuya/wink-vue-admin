import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { UpdatePluginDto } from './dto/update-plugin.dto'
import { Plugin } from './entities/plugin.entity'
import { isNotNull } from '@/common/utils/isNotNull'
import { Express } from 'express'
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs'
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
} from '@wink/compile'
import { BadParamsException } from '@/common/exception/bad-params-exception'
import { DefaultPluginInfo } from '@/config/plugin'
import { Permission } from '@/permission/entities/permission.entity'
import { RolePermission } from '@/common/entities/role-permission.entity'
import { exec } from 'child_process'
import * as WebSocket from 'ws'
import { BuildErrorException } from '@/common/exception/build-error-exception'

@Injectable()
export class PluginService {
	private timer: NodeJS.Timeout | null
	private readonly formatPath: string

	constructor(
		@InjectRepository(Plugin) private readonly pluginRepository: Repository<Plugin>,
		@InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
		@InjectRepository(RolePermission) private readonly rolePermissionRepository: Repository<RolePermission>
	) {
		this.timer = null
		this.formatPath = join(__dirname, '../../../../', 'script/format.mjs')
	}

	async create(file: Express.Multer.File) {
		const { originalname, buffer } = file
		const staticDir = join(process.cwd(), 'static')
		if (!existsSync(staticDir)) {
			mkdirSync(staticDir)
		}
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
		const routerPathCount = await this.pluginRepository.countBy({ routePath: routePath })
		if (DefaultPluginInfo.routePaths.includes(routePath) || routerPathCount > 0)
			throw new BadParamsException('40020')

		const description = getModuleDescription(astNode)
		const comment = getModuleComment(astNode)
		const permissionCount = await this.permissionRepository.countBy({ key: routerInfo.name })
		if (permissionCount > 0) throw new BadParamsException('40023')
		const parentPermission = await this.permissionRepository.findOneBy({ key: routerInfo.parentName })
		if (parentPermission) {
			await this.permissionRepository.save({
				title: comment,
				description,
				parentId: parentPermission.id,
				key: routerInfo.name,
				hasChildren: true
			})
			if (!parentPermission.hasChildren) {
				await this.permissionRepository.update(parentPermission.id, { hasChildren: true })
			}
		} else {
			await this.permissionRepository.save({
				title: comment,
				description,
				key: routerInfo.name,
				hasChildren: true
			})
		}
		const currentPermission = await this.permissionRepository.findOneBy({ key: routerInfo.name })
		await this.permissionRepository.save({
			title: `添加${comment}`,
			description: `添加${description}权限`,
			parentId: currentPermission.id,
			key: `${routerInfo.parentPath}_${routerInfo.path}_add`
		})
		await this.permissionRepository.save({
			title: `修改${comment}`,
			description: `修改${description}权限`,
			parentId: currentPermission.id,
			key: `${routerInfo.parentPath}_${routerInfo.path}_update`
		})
		await this.permissionRepository.save({
			title: `删除${comment}`,
			description: `删除${description}权限`,
			parentId: currentPermission.id,
			key: `${routerInfo.parentPath}_${routerInfo.path}_delete`
		})
		writeFileSync(join(staticDir, originalname), buffer)
		await this.pluginRepository.save({
			routeName,
			routePath,
			name: comment,
			key: pluginName,
			description,
			url: join('/static/', originalname)
		})
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

	async findAll(skip: number, take: number, search?: string) {
		if (isNotNull(skip) && isNotNull(take)) {
			let queryBuilder = this.pluginRepository.createQueryBuilder('plugin')
			if (search) {
				queryBuilder = queryBuilder
					.where('role.title like :search', { search: `%${search}%` })
					.orWhere('role.description like :search', { search: `%${search}%` })
			}
			const [list, total] = await queryBuilder.skip(skip).take(take).getManyAndCount()
			return {
				list,
				total
			}
		}
		await this.pluginRepository.find()
	}

	findOne(id: number) {
		return this.pluginRepository.findOneBy({ id })
	}

	update(id: number, updatePluginDto: UpdatePluginDto) {
		const pluginDto: any = {}
		const { name, description } = updatePluginDto
		if (name) pluginDto.name = name
		if (description) pluginDto.description = description
		return this.pluginRepository.update(id, pluginDto)
	}

	async remove(rid: number) {
		const pluginInfo = await this.pluginRepository.findOneBy({ id: rid })
		if (!pluginInfo) throw new BadParamsException('40024')

		const filePath = join(process.cwd(), pluginInfo.url)
		const { data, error } = analyse(readFileSync(filePath).toString())
		if (error) throw new BadParamsException('40019')
		const astNode = await nodeParser(data)
		const currentPermission = await this.permissionRepository.findOneBy({ key: pluginInfo.routeName })
		if (!currentPermission) throw new BadParamsException('40025')
		const childrenPermission = await this.permissionRepository.find({
			where: { parentId: currentPermission.id },
			select: ['id']
		})
		if (!childrenPermission) throw new BadParamsException('40025')
		const permissionIds = [...childrenPermission.map(p => p.id), currentPermission.id]
		await this.rolePermissionRepository.delete({
			permissionId: In(permissionIds)
		})
		await this.permissionRepository.softDelete({ parentId: currentPermission.id })
		await this.permissionRepository.softDelete(currentPermission.id)
		if (currentPermission.parentId) {
			const parentCount = await this.permissionRepository.countBy({ parentId: currentPermission.parentId })
			if (parentCount === 0) {
				await this.permissionRepository.update(currentPermission.parentId, { hasChildren: false })
			}
		}
		await this.pluginRepository.softDelete(rid)
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

	private execFileBuild() {
		let sendTimes = 0
		return new Promise((resolve, reject) => {
			exec(`node ${this.formatPath}`)
			// if (process.env.NODE_ENV === 'production') {
			const codePath = Math.random().toString(36).slice(-6)
			const ws = new WebSocket('ws://localhost:9527/build')
			ws.on('open', () => {
				ws.send(JSON.stringify({ key: 'ws_key', codePath }))
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
							ws.send(JSON.stringify({ key: 'ws_key', codePath }))
						} else {
							reject()
						}
					}
				}
			})
			// }
		})
	}
}
