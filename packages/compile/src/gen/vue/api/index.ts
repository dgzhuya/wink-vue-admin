import { join } from 'path'
import { createWebDir, writeWebFile } from '../util/fileUtil'
import { renderStrByTemplate } from '@/gen/util/renderUtil'
import { apiSource } from './template'
import { RouterConfig } from '@/gen/util/getInfoByAST'

export const genPluginAPI = (moduleName: string, upperModuleName: string, routerConfig: RouterConfig) => {
	const listDir = join('api', routerConfig.parentPath)
	createWebDir(listDir)
	const apiSourceStr = renderStrByTemplate(apiSource, {
		moduleName,
		upperModuleName,
		parentPath: routerConfig.parentPath
	})
	writeWebFile(`${moduleName}.ts`, apiSourceStr, listDir)
}
