import { IsIn, IsNotEmpty, IsOptional, IsString, Length, Matches, MaxLength } from 'class-validator'
import { LoginUserDto } from '@api/sys/dto/login-user.dto'
import { isNotNull } from '@api/common/utils/isNotNull'

export class CreateUserDto extends LoginUserDto {
	constructor(userDto?: CreateUserDto) {
		if (userDto) {
			super({ username: userDto.username, password: userDto.password })
			if (userDto) {
				this.nickname = userDto.nickname
				if (isNotNull(userDto.address)) this.address = userDto.address
				if (isNotNull(userDto.mobile)) this.mobile = userDto.mobile
				if (isNotNull(userDto.avatar)) this.avatar = userDto.avatar
				if (isNotNull(userDto.gender)) this.gender = userDto.gender
			}
		} else {
			super()
		}
	}
	@IsNotEmpty({ message: '昵称不能为空' })
	@Length(1, 50, { message: '昵称长度在1到20之间' })
	@IsString({ message: '昵称必须为字符串类型' })
	readonly nickname: string

	@IsOptional()
	@Matches(/^(\d*)$/, { message: '手机号须为数字' })
	readonly mobile?: string

	@IsOptional()
	@IsIn([0, 1], { message: '性别须设置为1或者0' })
	readonly gender?: number

	@IsOptional()
	@MaxLength(100, { message: '地址在100字以内' })
	readonly address?: string

	@IsOptional()
	readonly avatar?: string
}
