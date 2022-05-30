import { write2File } from '@/gen/util/fileUtil'
import { renderStrByTemplate } from '@/gen/util/renderUtil'
import { AssignStmt } from '@/parser/ast/AssignStmt'
import { ASTNode } from '@/parser/ast/ASTNode'
import { Translate } from '@/parser/utils/Types'
import {
	serviceAllSource,
	serviceCreateSource,
	serviceDeleteSource,
	serviceGetSource,
	serviceSource,
	serviceUpdateSource
} from './template'

export const genService = (moduleName: string, upperModuleName: string, astNode: ASTNode) => {
	const apiNode = astNode.findByKey('#api')
	if (apiNode !== null) {
		const dynamicConfig = {
			create: '',
			delete: '',
			update: '',
			getOne: '',
			getAll: ''
		}
		const assignValueElement = (apiNode as AssignStmt).getAssignValue()['#api'] as Translate
		if (assignValueElement['@get']) {
			dynamicConfig.getOne = serviceGetSource(moduleName)
		}
		if (assignValueElement['@all']) {
			dynamicConfig.getAll = serviceAllSource(moduleName)
		}
		if (assignValueElement['@delete']) {
			dynamicConfig.delete = serviceDeleteSource(moduleName)
		}
		if (assignValueElement['@update']) {
			dynamicConfig.update = serviceUpdateSource(moduleName, upperModuleName)
		}
		if (assignValueElement['@post']) {
			dynamicConfig.create = serviceCreateSource(moduleName, upperModuleName)
		}
		const serviceStr = renderStrByTemplate(serviceSource, { moduleName, upperModuleName, ...dynamicConfig })
		write2File(`${moduleName}.service.ts`, serviceStr, moduleName)
	}
}
