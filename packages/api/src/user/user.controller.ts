import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseInterceptors
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PageDto } from '@/common/dto/page.dto'
import { UserRoleDto, UserRolesDto } from '@/user/dto/user-role.dto'

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(new CreateUserDto(createUserDto))
	}

	@Get()
	findAll(@Query() pageDto: PageDto) {
		const { skip, take } = PageDto.setSkipTake(pageDto)
		return this.userService.table(skip, take, pageDto.search)
	}

	@Post('roles')
	setRoles(@Body() useRolesDto: UserRolesDto) {
		return this.userService.setRoles(useRolesDto)
	}

	@Post('major')
	setMajorRole(@Body() userDto: UserRoleDto) {
		return this.userService.setMajorRole(userDto)
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.userService.query(+id)
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.update(+id, new UpdateUserDto(updateUserDto))
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.userService.delete(+id)
	}
}
