import { ASTNode } from '@/parser/ast/ASTNode'
import { RouterConfig } from '@/gen/vue'
import { join } from 'path'
import { createWebDir, writeWebFile } from '@/gen/vue/util/fileUtil'
import { AssignStmt } from '@/parser/ast/AssignStmt'
import { Translate } from '@/parser/utils/Types'
import { dtoSource, modelSource } from '@/gen/vue/types/template'

export const genPluginTypes = (
	moduleName: string,
	upperModuleName: string,
	routerConfig: RouterConfig,
	astNode: ASTNode
) => {
	const typesDir = join('types', routerConfig.parentPath)
	createWebDir(typesDir)
	const modelTypeSource = {
		model: '',
		dto: ''
	}
	const tableNode = astNode.findByKey('#table')
	if (tableNode) {
		const tableFields = (tableNode as AssignStmt).getAssignValue()['#table'] as Translate
		const modelStr = Object.keys(tableFields)
			.map(key => {
				const element = tableFields[key] as string[]
				const genModelField = (type: string) => '\t' + `${key}: ${type}`
				if (element.includes('@number')) {
					return genModelField('number')
				}
				if (element.includes('@string')) {
					return genModelField('string')
				}
				if (element.includes('@boolean')) {
					return genModelField('boolean')
				}
				return ''
			})
			.filter(i => i !== '')
			.join('\n')
		modelTypeSource.model = modelSource(upperModuleName, modelStr)
	}
	const formNode = astNode.findByKey('#form')
	if (formNode) {
		const formFields = (formNode as AssignStmt).getAssignValue()['#form'] as Translate
		const formStr = Object.keys(formFields)
			.map(key => {
				const genModelField = (type: string) => '\t' + `${key}?: ${type}`
				const element = formFields[key] as string[]
				if (element.includes('@number')) {
					return genModelField('number')
				}
				if (element.includes('@string')) {
					return genModelField('string')
				}
				if (element.includes('@boolean')) {
					return genModelField('boolean')
				}
				return ''
			})
			.filter(i => i !== '')
			.join('\n')
		modelTypeSource.dto = dtoSource(upperModuleName, formStr)
	}
	if (modelTypeSource.dto || modelTypeSource.model) {
		const { dto: form, model: table } = modelTypeSource
		const lineBreak = form ? '\n' : ''
		writeWebFile(`${moduleName}.ts`, `${form}${lineBreak}${table}`, typesDir)
	}
}
