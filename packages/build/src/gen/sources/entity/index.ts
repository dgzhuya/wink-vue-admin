import { ASTNode } from '@/parser/ast/ASTNode'
import { upperCase } from '@/gen/util/upperCase'
import { renderStrByTemplate } from '@/gen/util/renderUtil'
import { join } from 'path'
import { createDir, write2File } from '@/gen/util/fileUtil'
import { AssignStmt } from '@/parser/ast/AssignStmt'
import { Translate } from '@/parser/utils/Types'
import { EntitySource } from './template'

export const genEntity = (moduleName: string, astNode: ASTNode) => {
	const modelNode = astNode.findByKey('#model')
	if (modelNode !== null) {
		const assignValueElement = (modelNode as AssignStmt).getAssignValue()['#model'] as Translate

		const columnList = Object.keys(assignValueElement)
			.map(key => {
				const genDtoField = (type: string) => `\n\t${key}: ${type}\n`
				const elements = assignValueElement[key] as string[]
				const columnSet = new Set()
				let fieldResult = ''
				let primaryStr = ''
				if (elements.includes('@nullable')) {
					columnSet.add('nullable: true')
				}
				if (elements.includes('@string')) {
					fieldResult += genDtoField('string')
				} else if (elements.includes('@number')) {
					fieldResult += genDtoField('number')
				} else if (elements.includes('@boolean')) {
					fieldResult += genDtoField('boolean')
				}
				if (elements.includes('@id')) {
					primaryStr = '\t@PrimaryGeneratedColumn()\n'
					columnSet.add('primary: true')
				}
				const columnList = Array.from(columnSet)
				return (
					primaryStr + `\t@Column(${columnList.length > 0 ? `{${columnList.join(', ')}}` : ''})` + fieldResult
				)
			})
			.join('\n')
		const upperModuleName = upperCase(moduleName)
		const entityStr = renderStrByTemplate(EntitySource, { upperModuleName, columnList })
		const entityPath = join(moduleName, 'entities')
		createDir(entityPath)
		write2File(`${moduleName}.entity.ts`, entityStr, entityPath)
	}
}
