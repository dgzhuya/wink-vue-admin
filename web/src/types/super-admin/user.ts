import { BaseModel } from '.'
import { RoleSimple } from './role'

export interface UserDto {
	username?: string
	nickname?: string
	gender?: number
	avatar?: string
	mobile?: number
	address?: string
}

export interface UserModel extends BaseModel, UserDto {
	id: number
	major?: number
	roles: RoleSimple[]
	roleIds: number[]
}

export interface CreateUserDto extends UserDto {
	password: string
}
