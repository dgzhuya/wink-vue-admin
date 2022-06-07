export const routerSource = `import { RouteRecordRaw } from 'vue-router'

export const %parentName%Route: RouteRecordRaw = {
	path: '/%parentPath%',
	component: () => import('@/layout/index.vue'),
	name: '%parentName%',
	meta: {
		title: '%parentTitle%',
		icon: '%parentIcon%'
	},
	redirect: '/%parentPath%/%moduleName%',
	children: [
		{
			path: '/%parentPath%/%moduleName%',
			component: () => import('@/views/%parentPath%/%moduleName%/list.vue'),
			name: '%name%',
			meta: {
				title: '%title%',
				icon: '%icon%'
			}
		}
	]
}
`
