import { ASTNode } from '@/parser/ast/ASTNode'
import { CreateDtoSource, UpdateDtoSource } from './template'
import { renderStrByTemplate } from '@/gen/util/renderUtil'
import { createNestDir, writeNestFile } from '@/gen/sources/util/fileUtil'
import { join } from 'path'
import { AssignStmt } from '@/parser/ast/AssignStmt'
import { Translate } from '@/parser/utils/Types'

export const genDTO = (moduleName: string, upperModuleName: string, astNode: ASTNode) => {
	const dtoNode = astNode.findByKey('#dto')
	if (dtoNode) {
		const assignValueElement = (dtoNode as AssignStmt).getAssignValue()['#dto'] as Translate

		const dtoList = Object.keys(assignValueElement)
			.map(key => {
				const elements = assignValueElement[key] as string[]
				const genDtoField = (type: string) => '\t' + `readonly ${key}: ${type}`
				if (elements.includes('@string')) {
					return genDtoField('string')
				}
				if (elements.includes('@number')) {
					return genDtoField('number')
				}
				if (elements.includes('@boolean')) {
					return genDtoField('boolean')
				}
				return ''
			})
			.filter(i => i !== '')
			.join('\n')
		const createDTOStr = renderStrByTemplate(CreateDtoSource, {
			upperModuleName,
			dtoList
		})

		const updateDTOStr = renderStrByTemplate(UpdateDtoSource, { upperModuleName, moduleName })
		const dtoPath = join(moduleName, 'dto')
		createNestDir(dtoPath)
		writeNestFile(`create-${moduleName}.dto.ts`, createDTOStr, dtoPath)
		writeNestFile(`update-${moduleName}.dto.ts`, updateDTOStr, dtoPath)
	}
}
