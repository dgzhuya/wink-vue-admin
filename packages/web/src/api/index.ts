import { StoreUserInfo } from '@web/types'
import { LoginParams, ResetParams } from '@web/types/super-admin'
import request from '@web/utils/request'

export const login = (data: LoginParams) => {
	return request<{ token: string }>({
		url: '/sys/login',
		method: 'POST',
		data
	})
}

export const getUserInfo = () => {
	return request<StoreUserInfo>({
		url: '/sys/profile'
	})
}

export const resetPassword = (data: ResetParams) => {
	return request<{ token: string }>({
		url: '/sys/password',
		method: 'POST',
		data
	})
}
