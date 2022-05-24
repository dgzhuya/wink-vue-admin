import router from '@/router'
import { useUser } from '@/store/module/user'
import { useApp } from './store/module/app'

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
