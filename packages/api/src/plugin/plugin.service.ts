import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreatePluginDto } from './dto/create-plugin.dto'
import { UpdatePluginDto } from './dto/update-plugin.dto'
import { Plugin } from './entities/plugin.entity'

@Injectable()
export class PluginService {
	constructor(@InjectRepository(Plugin) private readonly pluginRepository: Repository<Plugin>) {}

	create(createPluginDto: CreatePluginDto) {
		return this.pluginRepository.save(createPluginDto)
	}

	findAll() {
		return this.pluginRepository.find()
	}

	findOne(id: number) {
		return this.pluginRepository.findOne(id)
	}

	update(id: number, updatePluginDto: UpdatePluginDto) {
		return this.pluginRepository.update(id, updatePluginDto)
	}

	remove(rid: number) {
		return this.pluginRepository.softDelete(rid)
	}
}
