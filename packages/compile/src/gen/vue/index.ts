import { ASTNode } from '@/parser/ast/ASTNode'
import { AssignStmt } from '@/parser/ast/AssignStmt'
import { Translate } from '@/parser/utils/Types'

export interface ParentConfig {
	parentPath: string
	parentTitle: string
	parentIcon: string
}

export const genVueCode = (moduleName: string, upperModuleName: string, astNode: ASTNode) => {
	getParentInfo(astNode)
}

const getParentInfo = (astNode: ASTNode) => {
	const result: ParentConfig = {
		parentPath: '',
		parentTitle: '',
		parentIcon: ''
	}
	const routerItem = astNode.findByKey('#router')
	if (routerItem) {
		const exprVal = (routerItem as AssignStmt).getAssignValue()['#router'] as Translate
		if (exprVal.parentPath) {
			result.parentPath = (exprVal.parentPath as string[])[0]
		}
		if (exprVal.parentTitle) {
			result.parentTitle = (exprVal.parentTitle as string[])[0]
		}
		if (exprVal.parentIcon) {
			result.parentIcon = (exprVal.parentIcon as string[])[0]
		}
	}
	return result
}
