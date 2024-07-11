import { AdminMenuItem } from '@web/types'
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

export function formatPermissionKey(path: string) {
	const key = path
		.split('/')
		.filter(p => p)
		.join('_')
		.replaceAll('-', '_')
	return `#${key}`
}

export const filterPermissionRouters = (routes: RouteRecordRaw[], permissions: string[]) => {
	const result: RouteRecordRaw[] = []

	for (let i = 0; i < routes.length; i++) {
		const route = routes[i]
		if (route.children) {
			route.children = filterPermissionRouters(route.children, permissions)
		}
		const key = formatPermissionKey(route.path)
		if (route.path === '/' || permissions.includes(key)) {
			result.push(route)
		}
	}
	return result
}
