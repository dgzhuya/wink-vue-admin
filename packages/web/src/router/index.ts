import { MetaStruct } from '@web/types'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		component: () => import('@web/layout/index.vue'),
		redirect: '/profile',
		children: [
			{
				path: '/profile',
				component: () => import('@web/views/profile/index.vue'),
				meta: {
					title: '个人中心',
					icon: 'user'
				}
			},
			{
				path: '/401',
				meta: {
					title: '401',
					hidden: true
				},
				component: () => import('@web/views/error-page/401.vue')
			},
			{
				path: '/404',
				meta: {
					title: '404',
					hidden: true
				},
				component: () => import('@web/views/error-page/404.vue')
			}
		]
	},
	{
		path: '/login',
		meta: {
			title: '登录',
			noAuth: true
		},
		component: () => import('@web/views/login/index.vue')
	}
]

const metaInfo = import.meta.glob('../modules/**/meta.json', { import: 'default', eager: true })

const mataList: MetaStruct[] = Object.entries(metaInfo).map(([path, m]) => {
	const meta = m as MetaStruct
	meta.filePath = path.replace('meta.json', '') + 'index.vue'
	return meta
})
const map: Record<string, MetaStruct[]> = {}
for (let i = 0; i < mataList.length; i++) {
	const route = mataList[i]
	const pathList = route.path.split('/')
	pathList.pop()
	const parentPath = pathList.join('/') || '/'
	if (map[parentPath]) {
		map[parentPath].push(route)
	} else {
		map[parentPath] = [route]
	}
}
const pages = import.meta.glob('../modules/**/index.vue')
export const autoRoutes: RouteRecordRaw[] = map['/'].map(({ path, title, filePath, icon, redirect }) => {
	const children = map[path]
	const baseRoute: RouteRecordRaw = {
		path: children ? path : '/',
		component: () => import('@web/layout/index.vue'),
		children: children
			? children.map(({ path, filePath, title, icon }) => {
					return {
						path,
						meta: { title, icon },
						component: pages[filePath]
					}
				})
			: [
					{
						path,
						meta: { title, icon },
						component: pages[filePath]
					}
				]
	}
	if (children) {
		baseRoute['meta'] = { title, icon }
		baseRoute['redirect'] = redirect ? `${path}/${redirect}` : children[0].path
	}
	return baseRoute
})

const router = createRouter({
	history: createWebHistory(),
	routes
})

export default router
