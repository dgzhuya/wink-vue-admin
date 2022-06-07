import { renderStrByTemplate } from '@/gen/util/renderUtil'
import { join } from 'path'
import { RouterConfig } from '..'
import { isWebExit, writeWebFile } from '../util/fileUtil'
import { routerSource } from './template'

export const genPluginRouter = (moduleName: string, routerConfig: RouterConfig) => {
	const routerDir = join('router', 'module')
	const routerFile = join(routerDir, `${routerConfig.parentPath}.ts`)
	if (isWebExit(routerFile)) {
		console.log(routerFile)
	} else {
		const routerSourceStr = renderStrByTemplate(routerSource, {
			moduleName,
			...routerConfig
		})
		writeWebFile(`${moduleName}.ts`, routerSourceStr, routerDir)
	}
}
