import { setConfigPath } from '@/config'
import { translate } from '@/gen'
import { analyse } from '@/lexer'
import { nodeParser } from '@/parser'
import { getModuleDescription, getModuleName, getModuleComment, getRouterInfo } from '@/gen/util/getInfoByAST'

export {
	setConfigPath,
	translate,
	analyse,
	nodeParser,
	getModuleDescription,
	getModuleName,
	getModuleComment,
	getRouterInfo
}
