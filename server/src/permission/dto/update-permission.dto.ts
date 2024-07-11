import { IsNotEmpty, IsOptional, Length, MaxLength } from 'class-validator'

export class UpdatePermissionDto {
	@IsNotEmpty({ message: '权限名不能为空' })
	@Length(1, 30, { message: '权限名长度在1-30以内' })
	readonly title: string

	@IsOptional()
	@Length(1, 30, { message: '权限关键字长度在1-30以内' })
	readonly key: string

	@IsOptional()
	@MaxLength(200, { message: '角色描述在100字以内' })
	readonly description?: string
}
