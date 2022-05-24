import { ASTNode } from '@/parser/ast/ASTNode'
import { renderStrByTemplate } from '@/gen/util/renderUtil'
import {
	controllerAllSource,
	controllerCreateSource,
	controllerDeleteSource,
	controllerGetSource,
	controllerSource,
	controllerUpdateSource
} from './template'
import { upperCase } from '@/gen/util/upperCase'
import { write2File } from '@/gen/util/fileUtil'
import { AssignStmt } from '@/parser/ast/AssignStmt'
import { Translate } from '@/parser/utils/Types'

export const genController = (moduleName: string, astNode: ASTNode) => {
	const apiNode = astNode.findByKey('#api')
	if (apiNode !== null) {
		const reqMethodSet = new Set()
		const dynamicConfig = {
			create: '',
			delete: '',
			update: '',
			getOne: '',
			getAll: ''
		}
		const upperModuleName = upperCase(moduleName)
		const assignValueElement = (apiNode as AssignStmt).getAssignValue()['#api'] as Translate
		if (assignValueElement['@get']) {
			dynamicConfig.getOne = controllerGetSource(moduleName)
			reqMethodSet.add('Get')
			reqMethodSet.add('Param')
		}
		if (assignValueElement['@all']) {
			dynamicConfig.getAll = controllerAllSource(moduleName)
			reqMethodSet.add('Get')
		}
		if (assignValueElement['@delete']) {
			dynamicConfig.delete = controllerDeleteSource(moduleName)
			reqMethodSet.add('Param')
			reqMethodSet.add('Delete')
		}
		if (assignValueElement['@update']) {
			dynamicConfig.update = controllerUpdateSource(moduleName, upperModuleName)
			reqMethodSet.add('Param')
			reqMethodSet.add('Body')
			reqMethodSet.add('Patch')
		}
		if (assignValueElement['@post']) {
			dynamicConfig.create = controllerCreateSource(moduleName, upperModuleName)
			reqMethodSet.add('Body')
			reqMethodSet.add('Post')
		}
		const controllerStr = renderStrByTemplate(controllerSource, {
			moduleName,
			upperModuleName,
			...dynamicConfig,
			reqMethods: reqMethodSet.size > 0 ? ', ' + Array.from(reqMethodSet).join(' ,') : ''
		})
		write2File(`${moduleName}.controller.ts`, controllerStr, moduleName)
	}
}
