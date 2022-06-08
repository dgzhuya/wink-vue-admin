import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UpdatePluginDto } from './dto/update-plugin.dto'
import { Plugin } from './entities/plugin.entity'
import { isNotNull } from '@/common/utils/isNotNull'
import { Express } from 'express'
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import {
	nodeParser,
	analyse,
	getModuleName,
	getModuleComment,
	getModuleDescription,
	getRouterInfo
} from '@wink/compile'
import { BadParamsException } from '@/common/exception/bad-params-exception'

@Injectable()
export class PluginService {
	constructor(@InjectRepository(Plugin) private readonly pluginRepository: Repository<Plugin>) {}

	async create(file: Express.Multer.File) {
		const { originalname, buffer } = file
		const staticDir = join(__dirname, '../../static')
		if (!existsSync(staticDir)) {
			mkdirSync(staticDir)
		}
		const { data, error } = analyse(buffer.toString())
		if (error) throw new BadParamsException('40019')
		const astNode = await nodeParser(data)
		const comment = getModuleComment(astNode)
		const name = getModuleName(astNode)
		const description = getModuleDescription(astNode)
		const routerInfo = getRouterInfo(astNode)
		console.log(comment, name, description, routerInfo)
		console.log(join(__dirname, staticDir, originalname))
		writeFileSync(join(__dirname, staticDir, originalname), buffer)
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
		return this.pluginRepository.find()
	}

	findOne(id: number) {
		return this.pluginRepository.findOneBy({ id })
	}

	update(id: number, updatePluginDto: UpdatePluginDto) {
		return this.pluginRepository.update(id, updatePluginDto)
	}

	remove(rid: number) {
		return this.pluginRepository.softDelete(rid)
	}
}
