import { setConfigPath, getConfigPath } from '@/config'
import { translate, clearModule } from '@/gen'
import { analyse } from '@/lexer'
import { nodeParser } from '@/parser'
import { ASTNode } from '@/parser/ast/ASTNode'
import {
	getModuleDescription,
	getModuleName,
	getModuleComment,
	getRouterInfo,
	RouterConfig
} from '@/gen/util/getInfoByAST'

export {
	getConfigPath,
	setConfigPath,
	translate,
	analyse,
	nodeParser,
	getModuleDescription,
	getModuleName,
	getModuleComment,
	clearModule,
	getRouterInfo,
	ASTNode,
	RouterConfig
}
