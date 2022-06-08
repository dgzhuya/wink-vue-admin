import { editAsyncRoute } from '@/common/EditAsyncRoute'
import { editVueRouter } from '@/common/EditRouter'
import { RouterConfig } from '@/gen/util/getInfoByAST'
import { renderStrByTemplate } from '@/gen/util/renderUtil'
import { join } from 'path'
import { isWebExit, writeWebFile } from '../util/fileUtil'
import { routerSource } from './template'
import { HandleStatus } from '@/common/Status'

export const genPluginRouter = (moduleName: string, config: RouterConfig) => {
	const routerDir = join('router', 'module')
	const routerFile = join(routerDir, `${config.parentPath}.ts`)
	if (isWebExit(routerFile)) {
		editVueRouter(config.parentPath, config.parentName, {
			routeIcon: config.icon,
			routeTitle: config.title,
			routePath: `/${config.parentPath}/${config.path}`,
			routeName: config.name
		})
	} else {
		const routerSourceStr = renderStrByTemplate(routerSource, {
			moduleName,
			...config
		})
		editAsyncRoute(config.parentPath, `${config.parentName}Route`)
		writeWebFile(`${config.parentPath}.ts`, routerSourceStr, routerDir)
	}
}

export const clearPluginRouter = (config: RouterConfig) => {
	editVueRouter(
		config.parentPath,
		config.parentName,
		{
			routeIcon: config.icon,
			routeTitle: config.title,
			routePath: `/${config.parentPath}/${config.path}`,
			routeName: config.name
		},
		HandleStatus.REMOVE
	)
}
