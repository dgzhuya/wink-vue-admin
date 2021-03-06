import { ASTNode } from '@/parser/ast/ASTNode'
import { AssignStmt } from '@/parser/ast/AssignStmt'
import { Translate } from '@/parser/utils/Types'
import { renderStrByTemplate } from '@/gen/util/renderUtil'
import { formSource, genFormInput, genFormTextArea, genIfCondition } from '@/gen/vue/form/template'
import { createWebDir, writeWebFile } from '../util/fileUtil'
import { join } from 'path'
import { RouterConfig } from '@/gen/util/getInfoByAST'

export const genPluginForm = (
	moduleName: string,
	upperModuleName: string,
	moduleComment: string,
	routerConfig: RouterConfig,
	astNode: ASTNode
) => {
	createWebDir(join('views', routerConfig.parentPath))
	const formDir = join('views', routerConfig.parentPath, moduleName)
	createWebDir(formDir)

	const formNode = astNode.findByKey('#form')
	if (formNode) {
		const formFields = (formNode as AssignStmt).getAssignValue()['#form'] as Translate
		const moduleFormKeys = Object.keys(formFields)
			.map(key => `'${key}'`)
			.join(', ')
		const moduleForm = Object.keys(formFields)
			.map(key => {
				const element = formFields[key] as string[]
				const commentStr = element.find(e => /^comment:/.test(e))
				if (commentStr) {
					const comment = commentStr.split(':')[1]
					if (comment) {
						if (element.includes('@textarea')) {
							return genFormTextArea(moduleName, key, comment)
						}
						return genFormInput(moduleName, key, comment)
					}
				}
				return ''
			})
			.filter(i => i !== '')
			.join('')
		const createCondition = Object.keys(formFields)
			.map(key => {
				const element = formFields[key] as string[]
				const commentStr = element.find(e => /^comment:/.test(e))
				if (commentStr) {
					const comment = commentStr.split(':')[1]
					if (comment) {
						return genIfCondition(moduleName, key, comment)
					}
				}
				return ''
			})
			.filter(i => i !== '')
			.join('')
		const formSourceStr = renderStrByTemplate(formSource, {
			upperModuleName,
			moduleFormKeys,
			moduleName,
			moduleForm,
			moduleComment,
			createCondition,
			parentPath: routerConfig.parentPath
		})
		writeWebFile(`${moduleName}-form.vue`, formSourceStr, formDir)
	}
}
