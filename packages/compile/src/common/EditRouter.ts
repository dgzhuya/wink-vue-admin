import { getConfigPath } from '@/config'
import { resolve } from 'path'
import { ObjectLiteralExpression, Project, SyntaxKind } from 'ts-morph'
import { HandleStatus } from '@/common/Status'
import { removeWebDir } from '@/gen/vue/util/fileUtil'
import { editAsyncRoute } from '@/common/EditAsyncRoute'

interface GenRouteConfig {
	routePath: string
	routeName: string
	routeTitle: string
	routeIcon: string
}

const genRouterStr = (config: GenRouteConfig) => `{
	path: '${config.routePath}',
	component: () => import('@/views/${config.routePath}/list.vue'),
	name: '${config.routeName}',
	meta: {
		title: '${config.routeTitle}',
		icon: '${config.routeIcon}'
	}
}`

export const editVueRouter = (
	parentPath: string,
	parentName: string,
	config: GenRouteConfig,
	handleType: HandleStatus = HandleStatus.ADD
) => {
	const path = resolve(getConfigPath().outVueDir, 'router/module/', `${parentPath}.ts`)
	const project = new Project()
	project.addSourceFileAtPath(path)
	const sourceFile = project.getSourceFileOrThrow(path)

	const SuperAdminRoute = sourceFile.getVariableDeclarationOrThrow(parentName + 'Route')
	const init = SuperAdminRoute.getInitializerOrThrow()
	const obj = init as ObjectLiteralExpression
	const children = obj.getPropertyOrThrow('children')
	const routerChildren = children.getFirstChildByKindOrThrow(SyntaxKind.ArrayLiteralExpression)
	const element = routerChildren.getElements()
	if (config.routePath.length > 1 && handleType === HandleStatus.REMOVE) {
		for (let i = 0; i < element.length; i++) {
			const item = element[i]
			const str = item.getText()
			if (str.includes(config.routePath)) {
				routerChildren.removeElement(i)
			}
		}
	}
	if (handleType === HandleStatus.ADD) {
		routerChildren.addElement(genRouterStr(config))
	}
	if (routerChildren.getElements().length === 0) {
		editAsyncRoute(parentPath, parentName, HandleStatus.REMOVE)
		removeWebDir(path)
	} else {
		const redirect = obj.getPropertyOrThrow('redirect')
		redirect.remove()
		const text = element[0] as ObjectLiteralExpression
		const newPath = text.getPropertyOrThrow('path').getText().split(':')[1]
		obj.insertPropertyAssignment(4, { name: 'redirect', initializer: newPath })
	}
	sourceFile.saveSync()
}
