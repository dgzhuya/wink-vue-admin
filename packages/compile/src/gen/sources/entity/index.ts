import { ASTNode } from '@/parser/ast/ASTNode'
import { renderStrByTemplate } from '@/gen/util/renderUtil'
import { join } from 'path'
import { createNestDir, writeNestFile } from '@/gen/sources/util/fileUtil'
import { AssignStmt } from '@/parser/ast/AssignStmt'
import { Translate } from '@/parser/utils/Types'
import { EntitySource } from './template'

export const genEntity = (moduleName: string, upperModuleName: string, astNode: ASTNode) => {
	const modelNode = astNode.findByKey('#model')
	if (modelNode !== null) {
		const assignValueElement = (modelNode as AssignStmt).getAssignValue()['#model'] as Translate

		const baseEntityStr = {
			baseEntityImport: '',
			extendsBaseEntity: ''
		}

		const columnList = Object.keys(assignValueElement)
			.map(key => {
				const elements = assignValueElement[key] as string[]
				if (key === 'base' && elements.length === 1 && elements[0] === '@DateEntity') {
					baseEntityStr.baseEntityImport = `import { BaseEntity } from 'src/common/entities/base.entity'\n`
					baseEntityStr.extendsBaseEntity = `extends BaseEntity `
					return ''
				}
				const genDtoField = (type: string) => `\n\t${key}: ${type}\n`
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
			.filter(r => r !== '')
			.join('\n')
		const entityStr = renderStrByTemplate(EntitySource, { upperModuleName, columnList, ...baseEntityStr })
		const entityPath = join(moduleName, 'entities')
		createNestDir(entityPath)
		writeNestFile(`${moduleName}.entity.ts`, entityStr, entityPath)
	}
}
