import { TableParams } from '@web/types'
import { UserDto, CreateUserDto, UserModel } from '@web/types/super-admin/user'
import request from '@web/utils/request'

export const getUserList = (data: TableParams) => {
	return request<{ total: number; list: UserModel[] }>({
		url: '/user',
		params: data
	})
}

export const createUser = (data: CreateUserDto) => {
	return request({
		url: '/user',
		method: 'post',
		data
	})
}

export const setUserMajorRole = (uid: number, rid: number) => {
	return request({
		method: 'post',
		url: '/user/major',
		data: {
			id: uid,
			rid
		}
	})
}

export const updateUserInfo = (data: Partial<UserDto>, id: number) => {
	return request({
		method: 'patch',
		url: `/user/${id}`,
		data
	})
}

export const setUserRoles = (uid: number, roles: number[]) => {
	console.log('uid: number, roles:', uid, roles)
	return request({
		method: 'post',
		url: 'user/roles',
		data: {
			id: uid,
			rIds: roles
		}
	})
}

export const deleteUser = (uid: number) => {
	return request({
		url: `/user/${uid}`,
		method: 'delete'
	})
}
