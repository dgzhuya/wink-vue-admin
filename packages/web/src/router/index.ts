import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		component: () => import('@/layout/index.vue'),
		redirect: '/profile',
		children: [
			{
				path: '/profile',
				component: () => import('@/views/profile/index.vue'),
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
				component: () => import('@/views/error-page/401.vue')
			},
			{
				path: '/404',
				meta: {
					title: '404',
					hidden: true
				},
				component: () => import('@/views/error-page/404.vue')
			}
		]
	},
	{
		path: '/login',
		meta: {
			title: '登录',
			noAuth: true
		},
		component: () => import('@/views/login/index.vue')
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

export default router
