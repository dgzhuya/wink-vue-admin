import { renderStrByTemplate } from '@/gen/util/renderUtil'
import { ModuleSource } from './template'
import { writeNestFile } from '@/gen/sources/util/fileUtil'

export const genModule = (moduleName: string, upperModuleName: string) => {
	const moduleStr = renderStrByTemplate(ModuleSource, { moduleName, upperModuleName })
	writeNestFile(`${moduleName}.module.ts`, moduleStr, moduleName)
}
