import { useUser } from '@web/store/module/user'
import { RequestResult } from '@web/types'
import axios, { AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'

const service = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL,
	timeout: 120000
})

service.interceptors.request.use(config => {
	const user = useUser()
	config.headers = {
		...config.headers
	}
	if (user.getToken) {
		config.headers['Authorization'] = user.getToken
	}

	return config
})

const request = async <T = void>(config: AxiosRequestConfig) => {
	try {
		const response = await service.request<RequestResult<T>>({ method: 'GET', ...config })
		const result = response.data
		if (result.code === 401) {
			useUser().loginout()
		}
		if (result.code === 200) {
			return result.data
		}
		ElMessage.error(result.msg)
		return Promise.reject(result.msg)
	} catch (error) {
		ElMessage.error(error instanceof Error ? error.message : '网络请求失败')
		return Promise.reject(error)
	}
}

export default request
