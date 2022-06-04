import { ASTNode } from '@/parser/ast/ASTNode'
import { RouterConfig } from '@/gen/vue'

export const genPluginList = (
	moduleName: string,
	upperModuleName: string,
	routerConfig: RouterConfig,
	astNode: ASTNode
) => {
	console.log(moduleName, upperModuleName, routerConfig, astNode)
}
