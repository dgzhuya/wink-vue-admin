import router from '@/router'
import { useUser } from '@/store/module/user'
import { asyncRoutes } from './router/module'
import { useApp } from './store/module/app'
import { filterPermissionRouters } from './utils/route'

router.beforeEach(async (to, form, next) => {
	const user = useUser()
	const app = useApp()
	document.title = `${to.meta.title}`
	if (user.getToken) {
		if (to.meta.noAuth) {
			next('/')
		} else {
			if (!user.hasUserInfo) {
				await user.fetchUserInfo()
				const permissions = user.getPermissions
				const permissionsRoutes = filterPermissionRouters(asyncRoutes, permissions)
				permissionsRoutes.forEach(route => router.addRoute(route))
				router.addRoute({
					path: '/:pathMath(.*)',
					redirect: '/404'
				})
			}
			if (!to.meta.noAuth) {
				app.addTagView({ path: to.path, fullPath: to.fullPath, title: to.meta.title })
			}
			next()
		}
	} else {
		if (to.meta.noAuth) {
			next()
		} else {
			next('/login')
		}
	}
})
