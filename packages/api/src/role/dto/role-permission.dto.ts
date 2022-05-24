import { IsArray, IsNotEmpty, IsNumber } from 'class-validator'

export class RolePermissionDto {
	@IsNumber({ allowNaN: false }, { message: '角色ID需要为数字' })
	@IsNotEmpty({ message: '角色ID不能为空' })
	rid: number

	@IsArray({ message: '权限信息为数组' })
	@IsNotEmpty({ message: '角色权限信息不能为空' })
	permissions: number[]
}
