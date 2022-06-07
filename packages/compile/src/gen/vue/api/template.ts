export const apiSource = `import { TableParams } from '@/types'
import { %upperModuleName%Model, %upperModuleName%Dto } from '@/types/%parentPath%/%moduleName%'
import request from '@/utils/request'

export const get%upperModuleName%List = (data: TableParams) => {
	return request<{ total: number; list: %upperModuleName%Model[] }>({
		url: '/%moduleName%',
		params: data
	})
}

export const create%upperModuleName% = (data: %upperModuleName%Dto) => {
	return request({
		url: '/%moduleName%',
		method: 'post',
		data
	})
}

export const update%upperModuleName% = (data: %upperModuleName%Dto, id: number) => {
	return request({
		url: \`/%moduleName%/\${id}\`,
		method: 'patch',
		data
	})
}

export const delete%upperModuleName% = (id: number) => {
	return request({
		url: \`/%moduleName%/\${id}\`,
		method: 'delete'
	})
}
`
