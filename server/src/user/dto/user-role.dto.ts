import { IsArray, IsNotEmpty, IsNumber } from 'class-validator'

export class UserRolesDto {
	@IsNumber({ allowNaN: false }, { message: '用户ID需要为数字' })
	@IsNotEmpty({ message: '用户id不能为空' })
	id: number

	@IsArray({ message: '角色信息为数组' })
	@IsNotEmpty({ message: '用户角色信息不能为空' })
	rIds: number[]
}

export class UserRoleDto {
	@IsNumber({ allowNaN: false }, { message: '用户ID需要为数字' })
	@IsNotEmpty({ message: '用户id不能为空' })
	id: number

	@IsNumber({ allowNaN: false }, { message: '角色ID需要为数字' })
	@IsNotEmpty({ message: '角色信息不能为空' })
	rid: number
}
