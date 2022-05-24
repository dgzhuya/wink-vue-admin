import { IsNotEmpty, Length, Matches } from 'class-validator'

export class LoginUserDto {
	constructor(loginDto?: LoginUserDto) {
		if (loginDto) {
			this.username = loginDto.username
			this.password = loginDto.password
		}
	}

	@IsNotEmpty({ message: '用户名不能为空' })
	@Length(1, 20, { message: '用户名长度在1-10之间' })
	@Matches(/^([a-zA-Z])([a-zA-Z1-9_-]*)$/, { message: '用户名为数字字母或者下划线' })
	readonly username: string

	@IsNotEmpty({ message: '用户密码不能为空' })
	@Length(6, 20, { message: '密码长度在6-20之间' })
	readonly password: string
}
