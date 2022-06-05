import { ASTNode } from '@/parser/ast/ASTNode'
import { AssignStmt } from '@/parser/ast/AssignStmt'
import { Translate } from '@/parser/utils/Types'
import { genPluginTypes } from '@/gen/vue/types'
import { genPluginList } from '@/gen/vue/list'

export interface RouterConfig {
	parentPath: string
	parentTitle: string
	parentIcon: string
	path: string
	title: string
	icon: string
	name: string
}

export const genVueCode = (moduleName: string, upperModuleName: string, astNode: ASTNode) => {
	const routerConfig = getParentInfo(astNode)
	genPluginTypes(moduleName, upperModuleName, routerConfig, astNode)
	genPluginList(moduleName, upperModuleName, routerConfig, astNode)
}

const getParentInfo = (astNode: ASTNode) => {
	const result: RouterConfig = {
		parentPath: '',
		parentTitle: '',
		parentIcon: '',
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
