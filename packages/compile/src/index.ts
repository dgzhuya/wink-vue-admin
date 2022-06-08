import { setConfigPath } from '@/config'
import { translate } from '@/gen'
import { analyse } from '@/lexer'
import { nodeParser } from '@/parser'
import { getModuleDescription, getModuleName, getModuleComment, getRouterInfo } from '@/gen/util/getInfoByAST'
import { editAppModule } from './common/EditAppModule'
import { editAsyncRoute } from './common/EditAsyncRoute'
import { editVueRouter } from './common/EditRouter'

export {
	editAppModule,
	editAsyncRoute,
	editVueRouter,
	setConfigPath,
	translate,
	analyse,
	nodeParser,
	getModuleDescription,
	getModuleName,
	getModuleComment,
	getRouterInfo
}
