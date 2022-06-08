import { RouteRecordRaw } from 'vue-router'

export const ToolRoute: RouteRecordRaw = {
	path: '/tool',
	component: () => import('@/layout/index.vue'),
	name: 'Tool',
	meta: {
		title: '工具管理',
		icon: 'tool'
	},
	redirect: '/tool/plugin',
	children: [
		{
			path: '/tool/plugin',
			component: () => import('@/views/tool/plugin/list.vue'),
			name: 'ToolPlugin',
			meta: {
				title: '插件管理',
				icon: 'plugin'
			}
		}
	]
}
