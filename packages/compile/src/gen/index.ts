import { ASTNode } from '@/parser/ast/ASTNode'
import { upperCase } from '@/gen/util/upperCase'
import { genNestModule } from '@/gen/sources'
import { genVueCode } from '@/gen/vue'
import { getModuleName, RouterConfig } from '@/gen/util/getInfoByAST'
import { removeNestDir } from '@/gen/sources/util/fileUtil'
import { editAppModule } from '@/common/EditAppModule'
import { HandleStatus } from '@/common/Status'
import { clearPluginRouter } from '@/gen/vue/router'
import { join } from 'path'
import { removeWebDir } from '@/gen/vue/util/fileUtil'

export const translate = (astNode: ASTNode) => {
	const moduleName = getModuleName(astNode)
	const upperModuleName = upperCase(moduleName)

	genNestModule(moduleName, upperModuleName, astNode)
	genVueCode(moduleName, upperModuleName, astNode)
}

export const clearModule = (moduleName: string, routerConfig: RouterConfig) => {
	removeNestDir(moduleName)
	const upperModuleName = upperCase(moduleName)
	editAppModule(moduleName, upperModuleName, HandleStatus.REMOVE)
	clearPluginRouter(routerConfig)
	const webPathList = ['types', 'api']
	webPathList.forEach(webPath => {
		removeWebDir(join(webPath, routerConfig.parentPath))
	})
	removeWebDir(join('views', routerConfig.parentPath, routerConfig.path))
}
