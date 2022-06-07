import { editAsyncRoute } from '@/common/EditAsyncRoute'
import { editVueRouter } from '@/common/EditRouter'
import { renderStrByTemplate } from '@/gen/util/renderUtil'
import { join } from 'path'
import { RouterConfig } from '..'
import { isWebExit, writeWebFile } from '../util/fileUtil'
import { routerSource } from './template'

export const genPluginRouter = (moduleName: string, routerConfig: RouterConfig) => {
	const routerDir = join('router', 'module')
	const routerFile = join(routerDir, `${routerConfig.parentPath}.ts`)
	if (isWebExit(routerFile)) {
		editVueRouter(routerConfig.parentPath, {
			viewPath: `${routerConfig.parentPath}/${routerConfig.path}`,
			...routerConfig,
			path: `/${routerConfig.parentPath}/${routerConfig.path}`
		})
	} else {
		const routerSourceStr = renderStrByTemplate(routerSource, {
			moduleName,
			...routerConfig
		})
		editAsyncRoute(routerConfig.parentPath, `${routerConfig.parentName}Route`)
		writeWebFile(`${routerConfig.parentPath}.ts`, routerSourceStr, routerDir)
	}
}
