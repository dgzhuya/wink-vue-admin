import { ASTNode } from '@/parser/ast/ASTNode'
import { AssignStmt } from '@/parser/ast/AssignStmt'
import { Translate } from '@/parser/utils/Types'
import { NodeType } from '@/parser/ast/NodeType'

export interface RouterConfig {
	parentPath: string
	parentTitle: string
	parentIcon: string
	parentName: string
	path: string
	title: string
	icon: string
	name: string
}

export const getRouterInfo = (astNode: ASTNode) => {
	const result: RouterConfig = {
		parentPath: '',
		parentTitle: '',
		parentIcon: '',
		parentName: '',
		path: '',
		title: '',
		icon: '',
		name: ''
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
		if (exprVal.parentName) {
			result.parentName = (exprVal.parentName as string[])[0]
		}
		if (exprVal.path) {
			result.path = (exprVal.path as string[])[0]
		}
		if (exprVal.title) {
			result.title = (exprVal.title as string[])[0]
		}
		if (exprVal.icon) {
			result.icon = (exprVal.icon as string[])[0]
		}
		if (exprVal.name) {
			result.name = (exprVal.name as string[])[0]
		}
	}
	return result
}

const getConfigByAST = (astNode: ASTNode, key: string) => {
	const moduleNode = astNode.findByKey(key)
	if (moduleNode) {
		const exprValue = (moduleNode as AssignStmt).getAssignValue()
		if (exprValue[key]) {
			return (exprValue[key] as string[])[0]
		}
	}
	return ''
}

export const getModuleComment = (astNode: ASTNode) => getConfigByAST(astNode, '#comment')

export const getModuleName = (astNode: ASTNode) => getConfigByAST(astNode, '#name')

export const getModuleDescription = (astNode: ASTNode) => getConfigByAST(astNode, '#description')
