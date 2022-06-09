import { Controller, Get, Param, Delete, Body, Patch, Post, Query, UseInterceptors, UploadedFile } from '@nestjs/common'
import { PluginService } from './plugin.service'
import { UpdatePluginDto } from './dto/update-plugin.dto'
import { PageDto } from '@/common/dto/page.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { Express } from 'express'

@Controller('plugin')
export class PluginController {
	constructor(private readonly pluginService: PluginService) {}

	@Post()
	@UseInterceptors(FileInterceptor('file'))
	create(@UploadedFile() file: Express.Multer.File) {
		return this.pluginService.create(file)
	}

	@Get()
	findAll(@Query() pageDto: PageDto) {
		const { skip, take } = PageDto.setSkipTake(pageDto)
		return this.pluginService.findAll(skip, take, pageDto.search)
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.pluginService.findOne(+id)
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updatePluginDto: UpdatePluginDto) {
		return this.pluginService.update(+id, updatePluginDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.pluginService.remove(+id)
	}
}
