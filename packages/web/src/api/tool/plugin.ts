import { TableParams } from '@/types'
import { PluginModel, PluginDto } from '@/types/tool/plugin'
import request from '@/utils/request'

export const getPluginList = (data: TableParams) => {
	return request<{ total: number; list: PluginModel[] }>({
		url: '/plugin',
		params: data
	})
}

export const createPlugin = (data: PluginDto) => {
	return request({
		url: '/plugin',
		method: 'post',
		data
	})
}

export const updatePlugin = (data: PluginDto, id: number) => {
	return request({
		url: `/plugin/${id}`,
		method: 'patch',
		data
	})
}

export const deletePlugin = (id: number) => {
	return request<string>({
		url: `/plugin/${id}`,
		method: 'delete'
	})
}
