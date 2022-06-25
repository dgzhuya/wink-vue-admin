import { setConfigPath, getConfigPath } from '@/config'
import { translate, clearModule } from '@/gen'
import { analyse } from '@/lexer'
import { nodeParser } from '@/parser'
import { getModuleDescription, getModuleName, getModuleComment, getRouterInfo } from '@/gen/util/getInfoByAST'

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
	getRouterInfo
}
