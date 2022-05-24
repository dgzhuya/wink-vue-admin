import { ASTNode } from '@/parser/ast/ASTNode'
import { createDir } from './util/fileUtil'
import { NodeType } from '@/parser/ast/NodeType'
import { AssignStmt } from '@/parser/ast/AssignStmt'
import { genController } from './sources/controller'
import { genDTO } from './sources/dto'
import { genEntity } from './sources/entity'
import { genModule } from './sources/module'
import { genService } from './sources/service'
import { editAppModule } from '@/common/EditAppModule'

export const translate = (astNode: ASTNode) => {
	const moduleName = getModuleName(astNode)
	createDir(moduleName)
	genController(moduleName, astNode)
	genDTO(moduleName, astNode)
	genEntity(moduleName, astNode)
	genModule(moduleName)
	genService(moduleName, astNode)
	editAppModule(moduleName)
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
