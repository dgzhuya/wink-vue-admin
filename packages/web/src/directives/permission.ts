import { useUser } from '@/store/module/user'
import { App } from 'vue'

export default (app: App<Element>) => {
	const user = useUser()
	app.directive('permission', (el: HTMLElement, { value }) => {
		if (typeof value === 'object') {
			const permission = user.getPermissions
			const hasPermission = permission.some(p => value.includes(p))
			if (!hasPermission) {
				el.parentNode && el.parentNode.removeChild(el)
			}
		}
	})
}
