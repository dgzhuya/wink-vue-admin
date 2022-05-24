import { StoreUserInfo } from '@/types'
import { LoginParams } from '@/types/super-admin'
import request from '@/utils/request'

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
