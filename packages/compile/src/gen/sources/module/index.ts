import { renderStrByTemplate } from '@/gen/util/renderUtil'
import { ModuleSource } from './template'
import { write2File } from '@/gen/util/fileUtil'

export const genModule = (moduleName: string, upperModuleName: string) => {
	const moduleStr = renderStrByTemplate(ModuleSource, { moduleName, upperModuleName })
	write2File(`${moduleName}.module.ts`, moduleStr, moduleName)
}
