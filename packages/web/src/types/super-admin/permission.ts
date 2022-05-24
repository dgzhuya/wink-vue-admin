import { BaseModel } from '.'

export interface PermissionSimple {
	id: number
	title: string
}

export interface PermissionTree extends PermissionSimple {
	children?: PermissionTree[]
}

export interface PermissionModel extends PermissionSimple, BaseModel {
	key?: string
	description?: string
	parentId?: number
	children?: PermissionModel[]
}

export interface PermissionDto {
	title: string
	key?: string
	description: string
}

export interface CreatePermissionDto extends PermissionDto {
	parentId?: number
}
