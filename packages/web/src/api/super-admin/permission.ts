import { TableParams } from '@/types'
import { PermissionModel, PermissionDto, CreatePermissionDto, PermissionTree } from '@/types/super-admin/permission'
import request from '@/utils/request'

export const getPermissionList = (data: TableParams) => {
	return request<{ total: number; list: PermissionModel[] }>({
		url: '/permission',
		params: data
	})
}

export const createPermission = (data: CreatePermissionDto) => {
	return request({
		url: '/permission',
		method: 'post',
		data
	})
}

export const deletePermission = (pid: number) => {
	return request({
		url: `/permission/${pid}`,
		method: 'delete'
	})
}

export const updatePermission = (data: Partial<PermissionDto>, pid: number) => {
	return request({
		url: `/permission/${pid}`,
		method: 'patch',
		data
	})
}

export const getPermissionTree = () => {
	return request<PermissionTree[]>({
		url: '/permission/tree'
	})
}

export const getPermissionsByParent = (id: number) => {
	return request<PermissionModel[]>({
		url: `/permission/${id}/children`
	})
}
