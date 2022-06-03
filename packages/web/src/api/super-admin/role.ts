import { TableParams } from '@/types'
import { RoleModel, RoleDto, RoleSimple } from '@/types/super-admin/role'
import request from '@/utils/request'

export const getRoleList = (data: TableParams) => {
	return request<{ total: number; list: RoleModel[] }>({
		url: '/role',
		params: data
	})
}

export const getAllRoles = () => {
	return request<RoleSimple[]>({
		url: '/role/all'
	})
}

export const getRolePermissions = (rid: number) => {
	return request<number[]>({
		url: `/role/${rid}/permission`
	})
}

export const setRolePermission = (rid: number, permissions: number[]) => {
	return request({
		url: '/role/permission',
		method: 'post',
		data: {
			rid,
			permissions
		}
	})
}

export const createRole = (data: RoleDto) => {
	return request({
		url: '/role',
		method: 'post',
		data
	})
}

export const updateRole = (data: Partial<RoleDto>, rid: number) => {
	return request({
		url: `/role/${rid}`,
		method: 'patch',
		data
	})
}

export const deleteRole = (rid: number) => {
	return request({
		url: `/role/${rid}`,
		method: 'delete'
	})
}
