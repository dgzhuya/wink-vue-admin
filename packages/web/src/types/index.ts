import { UserModel } from './super-admin/user'

export interface RequestResult<T> {
	code?: number
	msg: string
	data: T
}

export interface TableParams {
	search?: string
	count?: number
	page?: number
}

export interface TableResult<T> {
	list: T
	total: number
}

export interface AdminMenuItem {
	path: string
	title: string
	icon?: string
	children?: AdminMenuItem[]
}

export interface TagItem {
	title: string
	path: string
	fullPath: string
}

export interface StoreUserInfo extends Partial<UserModel> {
	permissions?: string[]
}
