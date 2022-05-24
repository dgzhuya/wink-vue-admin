import { BaseModel } from '.'

export interface RoleSimple {
	id: number
	title: string
}

export interface RoleModel extends RoleSimple, BaseModel {
	description?: string
}

export interface RoleDto {
	title: string
	description: string
}
