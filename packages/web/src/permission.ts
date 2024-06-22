import router, { autoRoutes } from '@web/router'
import { useUser } from '@web/store/module/user'
import { asyncRoutes } from './router/module'
import { useApp } from './store/module/app'
import { filterPermissionRouters } from './utils/route'

router.beforeEach(async (to, form, next) => {
	const user = useUser()
	const app = useApp()
	document.title = `${to.meta.title}`
	if (user.getToken) {
		if (!user.hasUserInfo) {
			await user.fetchUserInfo()
			const permissions = user.getPermissions
			if (permissions.length > 0) {
				const permissionsRoutes = filterPermissionRouters(asyncRoutes, permissions)
				permissionsRoutes.forEach(router.addRoute)
				autoRoutes.forEach(router.addRoute)
				router.addRoute({
					path: '/:pathMath(.*)',
					name: '404',
					redirect: '/404'
				})
				return next(to.path)
			}
		}
		if (to.meta.noAuth) {
			next('/')
		} else {
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
