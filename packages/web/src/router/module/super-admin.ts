import { RouteRecordRaw } from 'vue-router'

export const SuperAdminRoute: RouteRecordRaw = {
	path: '/super-admin',
	component: () => import('@web/layout/index.vue'),
	name: 'SuperAdmin',
	meta: {
		title: '系统管理',
		icon: 'personnel'
	},
	redirect: '/super-admin/user',
	children: [
		{
			path: '/super-admin/user',
			component: () => import('@web/views/super-admin/user/list.vue'),
			name: 'AdminUser',
			meta: {
				title: '用户管理',
				icon: 'personnel-manage'
			}
		},
		{
			path: '/super-admin/role',
			component: () => import('@web/views/super-admin/role/list.vue'),
			name: 'AdminRole',
			meta: {
				title: '角色管理',
				icon: 'role'
			}
		},
		{
			path: '/super-admin/permission',
			component: () => import('@web/views/super-admin/permission/list.vue'),
			name: 'AdminPermission',
			meta: {
				title: '权限管理',
				icon: 'permission'
			}
		}
	]
}
