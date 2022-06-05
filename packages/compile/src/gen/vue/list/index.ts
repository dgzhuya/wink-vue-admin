import { ASTNode } from '@/parser/ast/ASTNode'
import { RouterConfig } from '@/gen/vue'
import { join } from 'path'
import { renderStrByTemplate } from '@/gen/util/renderUtil'
import { listSource } from '@/gen/vue/list/template'
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
				const genTableField = (comment: string) =>
					'\t'.repeat(4) +
					`<el-table-column prop="${key}" label="${comment}"> </el-table-column>
`
				const commentStr = element.find(e => /^comment:/.test(e))
				if (commentStr) {
					const commentArr = commentStr.split(':')
					if (commentArr.length > 0) {
						if (element.includes('@date')) {
							return `${'\t'.repeat(4)}<el-table-column label="${commentArr[1]}" :width="180">
					<template #default="{ row }">
						{{ dateHandler(row.${key}) }}
					</template>
				</el-table-column>\n`
						}
						return genTableField(commentArr[1])
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
