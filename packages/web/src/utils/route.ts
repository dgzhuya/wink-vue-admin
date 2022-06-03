import { AdminMenuItem } from '@/types'
import { RouteRecordRaw } from 'vue-router'

const getChildrenRoutes = (routes: RouteRecordRaw[]) => {
	const result: RouteRecordRaw[] = []
	routes.forEach(route => {
		if (route.children && route.children.length > 0) {
			result.push(...route.children)
		}
	})
	return result
}

export const filterRouters = (routes: RouteRecordRaw[]) => {
	const childrenRoutes = getChildrenRoutes(routes)
	return routes.filter(route => !childrenRoutes.find(childrenRoute => childrenRoute.path === route.path))
}

export function generateMenus(routes: RouteRecordRaw[]) {
	const result: AdminMenuItem[] = []
	routes.forEach(item => {
		if (!item.meta || Object.keys(item.meta).length === 0) {
			if (item.children && item.children.length > 0) {
				result.push(...generateMenus(item.children))
			}
		} else if (!item.meta.noAuth && !item.meta.hidden && !item.meta.white) {
			let route = result.find(route => route.path === item.path)
			if (!route) {
				route = {
					path: item.path,
					title: item.meta.title,
					icon: item.meta.icon,
					children: []
				}
				result.push(route)
			}

			if (item.children && route.children) {
				route.children.push(...generateMenus(item.children))
			}
		}
	})
	return result
}

export const filterPermissionRouters = (routes: RouteRecordRaw[], permissions: string[]) => {
	const result: RouteRecordRaw[] = []
	for (let i = 0; i < routes.length; i++) {
		const route = routes[i]
		if (route.children) {
			const childrenRoute = filterPermissionRouters(route.children, permissions)
			if (childrenRoute.length > 0) {
				route.children = childrenRoute
				result.push(route)
			}
		} else {
			if (typeof route.name === 'string' && permissions.includes(route.name)) {
				result.push(route)
			}
		}
	}
	return result
}
