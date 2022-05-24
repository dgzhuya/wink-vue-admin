import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { PermissionService } from './permission.service'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import { PageDto } from '@/common/dto/page.dto'

@Controller('permission')
export class PermissionController {
	constructor(private readonly permissionService: PermissionService) {}

	@Post()
	create(@Body() createPermissionDto: CreatePermissionDto) {
		return this.permissionService.create(createPermissionDto)
	}

	@Get()
	findAll(@Query() pageDto: PageDto) {
		const { skip, take } = PageDto.setSkipTake(pageDto)
		return this.permissionService.searchPermission(skip, take, pageDto.search)
	}

	@Get('tree')
	findTreeByNode() {
		return this.permissionService.getPermissionTree()
	}

	@Get(':id/children')
	findByParent(@Param('id') id: string) {
		return this.permissionService.getPermissionByParent(+id)
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.permissionService.findOne(+id)
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
		return this.permissionService.update(+id, updatePermissionDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.permissionService.remove(+id)
	}
}
