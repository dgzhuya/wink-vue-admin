import { IsNotEmpty, IsOptional, Length, MaxLength } from 'class-validator'

export class CreateRoleDto {
	@IsNotEmpty({ message: '角色名不能为空' })
	@Length(1, 30, { message: '角色描述长度在1-30以内' })
	readonly title: string

	@IsOptional()
	@MaxLength(200, { message: '角色描述在100字以内' })
	readonly description?: string
}
