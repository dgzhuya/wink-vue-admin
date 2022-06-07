import { ASTNode } from '@/parser/ast/ASTNode'
import { AssignStmt } from '@/parser/ast/AssignStmt'
import { Translate } from '@/parser/utils/Types'
import { genPluginTypes } from '@/gen/vue/types'
import { genPluginList } from '@/gen/vue/list'
import { genPluginForm } from '@/gen/vue/form'
import { genPluginAPI } from './api'
import { genPluginRouter } from './router'
import { getModuleComment, getRouterInfo } from '@/gen/util/getInfoByAST'

export const genVueCode = (moduleName: string, upperModuleName: string, astNode: ASTNode) => {
	const routerConfig = getRouterInfo(astNode)
	const moduleComment = getModuleComment(astNode)
	genPluginTypes(moduleName, upperModuleName, routerConfig, astNode)
	genPluginList(moduleName, upperModuleName, moduleComment, routerConfig, astNode)
	genPluginForm(moduleName, upperModuleName, moduleComment, routerConfig, astNode)
	genPluginAPI(moduleName, upperModuleName, routerConfig)
	genPluginRouter(moduleName, routerConfig)
}
