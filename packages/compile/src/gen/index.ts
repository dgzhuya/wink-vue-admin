import { ASTNode } from '@/parser/ast/ASTNode'
import { createNestDir } from './sources/util/fileUtil'
import { NodeType } from '@/parser/ast/NodeType'
import { AssignStmt } from '@/parser/ast/AssignStmt'
import { upperCase } from '@/gen/util/upperCase'
import { genNestModule } from '@/gen/sources'
import { genVueCode } from '@/gen/vue'

export const translate = (astNode: ASTNode) => {
	const moduleName = getModuleName(astNode)
	const upperModuleName = upperCase(moduleName)

	createNestDir(moduleName)
	genNestModule(moduleName, upperModuleName, astNode)
	genVueCode(moduleName, upperModuleName, astNode)
}

const getModuleName = (node: ASTNode) => {
	const moduleNode = node.findByKey('#name')
	if (moduleNode !== null && moduleNode.type === NodeType.ASSIGN_STMT) {
		const exprValue = (moduleNode as AssignStmt).getAssignValue()
		if (exprValue['#name'] !== null && exprValue['#name'].length > 0) {
			return (exprValue['#name'] as never)[0]
		}
	}
	return 'example'
}
