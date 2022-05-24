import { IsIn, IsOptional, IsString, Length, Matches } from 'class-validator'
import { isNotNull } from '@/common/utils/isNotNull'

export class UpdateUserDto {
	constructor(userDto?: UpdateUserDto) {
		if (userDto) {
			if (isNotNull(userDto.username)) this.username = userDto.username
			if (isNotNull(userDto.nickname)) this.nickname = userDto.nickname
			if (isNotNull(userDto.mobile)) this.mobile = userDto.mobile
			if (isNotNull(userDto.address)) this.address = userDto.address
			if (isNotNull(userDto.avatar)) this.avatar = userDto.avatar
			if (isNotNull(userDto.gender)) this.gender = userDto.gender
		}
	}

	@IsOptional()
	@Length(1, 20, { message: '用户名长度在1-10之间' })
	@Matches(/^([a-zA-Z])([a-zA-Z1-9_-]*)$/, { message: '用户名为数字字母或者下划线' })
	readonly username?: string

	@IsOptional()
	@Length(1, 50, { message: '昵称长度在1到20之间' })
	@IsString({ message: '昵称必须为字符串类型' })
	readonly nickname?: string

	@IsOptional()
	@Matches(/^(\d*)$/, { message: '手机号须为数字' })
	readonly mobile?: string

	@IsOptional()
	@IsIn([0, 1], { message: '性别须设置为1或者0' })
	readonly gender?: number

	@IsOptional()
	readonly address?: string

	@IsOptional()
	readonly avatar?: string
}
