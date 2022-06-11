import { IsNotEmpty, Length } from 'class-validator'

export class ResetPasswordDto {
	@IsNotEmpty({ message: '用户密码不能为空' })
	@Length(6, 20, { message: '密码长度在6-20之间' })
	readonly currentPassword: string

	@IsNotEmpty({ message: '用户新密码不能为空' })
	@Length(6, 20, { message: '密码长度在6-20之间' })
	readonly newPassword: string
}
