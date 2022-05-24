import { ASTNode } from '@/parser/ast/ASTNode'
import { CreateDtoSource, UpdateDtoSource } from './template'
import { renderStrByTemplate } from '@/gen/util/renderUtil'
import { upperCase } from '@/gen/util/upperCase'
import { createDir, write2File } from '@/gen/util/fileUtil'
import { join } from 'path'
import { AssignStmt } from '@/parser/ast/AssignStmt'
import { Translate } from '@/parser/utils/Types'

export const genDTO = (moduleName: string, astNode: ASTNode) => {
	const modelNode = astNode.findByKey('#model')
	if (modelNode !== null) {
		const assignValueElement = (modelNode as AssignStmt).getAssignValue()['#model'] as Translate

		const upperModuleName = upperCase(moduleName)
		const dtoList = Object.keys(assignValueElement)
			.map(key => {
				const elements = assignValueElement[key] as string[]
				const genDtoField = (type: string) => '\t' + `readonly ${key}: ${type}`
				if (elements.includes('@dto')) {
					if (elements.includes('@string')) {
						return genDtoField('string')
					}
					if (elements.includes('@number')) {
						return genDtoField('number')
					}
					if (elements.includes('@boolean')) {
						return genDtoField('boolean')
					}
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
		createDir(dtoPath)
		write2File(`create-${moduleName}.dto.ts`, createDTOStr, dtoPath)
		write2File(`update-${moduleName}.dto.ts`, updateDTOStr, dtoPath)
	}
}
