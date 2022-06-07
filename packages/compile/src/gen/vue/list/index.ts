import { ASTNode } from '@/parser/ast/ASTNode'
import { RouterConfig } from '@/gen/vue'
import { join } from 'path'
import { renderStrByTemplate } from '@/gen/util/renderUtil'
import { genDateField, genTableField, listSource } from '@/gen/vue/list/template'
import { createWebDir, writeWebFile } from '../util/fileUtil'
import { AssignStmt } from '@/parser/ast/AssignStmt'
import { Translate } from '@/parser/utils/Types'

export const genPluginList = (
	moduleName: string,
	upperModuleName: string,
	moduleComment: string,
	routerConfig: RouterConfig,
	astNode: ASTNode
) => {
	const listDir = join('views', routerConfig.parentPath)
	createWebDir(listDir)

	const tableNode = astNode.findByKey('#table')
	if (tableNode) {
		const tableFields = (tableNode as AssignStmt).getAssignValue()['#table'] as Translate
		const tableFieldStr = Object.keys(tableFields)
			.map(key => {
				const element = tableFields[key] as string[]
				const commentStr = element.find(e => /^comment:/.test(e))
				if (commentStr) {
					const comment = commentStr.split(':')[1]
					if (comment) {
						if (element.includes('@date')) {
							return genDateField(key, comment)
						}
						return genTableField(key, comment)
					}
				}
				return ''
			})
			.filter(i => i !== '')
			.join('')
		const listVueStr = renderStrByTemplate(listSource, {
			moduleName,
			upperModuleName,
			moduleComment,
			parentPath: routerConfig.parentPath,
			tableFieldStr
		})
		writeWebFile('list.vue', listVueStr, listDir)
	}
}
