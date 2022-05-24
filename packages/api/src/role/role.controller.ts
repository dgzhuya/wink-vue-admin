import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { RoleService } from './role.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { RolePermissionDto } from '@/role/dto/role-permission.dto'
import { PageDto } from '@/common/dto/page.dto'

@Controller('role')
export class RoleController {
	constructor(private readonly roleService: RoleService) {}

	@Post()
	create(@Body() createRoleDto: CreateRoleDto) {
		return this.roleService.create(createRoleDto)
	}

	@Post('permission')
	setRolePermission(@Body() rolePermissionDto: RolePermissionDto) {
		return this.roleService.setRolePermission(rolePermissionDto)
	}

	@Get('/all')
	getAllRoles() {
		return this.roleService.finaAllRole()
	}

	@Get()
	findAll(@Query() pageDto: PageDto) {
		const { skip, take } = PageDto.setSkipTake(pageDto)
		return this.roleService.findRole(skip, take, pageDto.search)
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.roleService.findOne(+id)
	}

	@Get(':id/permission')
	findPermissions(@Param('id') id: string) {
		return this.roleService.getRolePermissions(+id)
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
		return this.roleService.update(+id, updateRoleDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.roleService.remove(+id)
	}
}
