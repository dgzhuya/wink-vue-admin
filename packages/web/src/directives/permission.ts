import { PermissionPageType } from '@web/env'
import { useUser } from '@web/store/module/user'
import { formatPermissionKey } from '@web/utils/route'
import { App, DirectiveBinding } from 'vue'
import router from '@web/router'

export default (app: App<Element>) => {
	const user = useUser()
	app.directive('permission', {
		mounted: (el: HTMLElement, { value }: DirectiveBinding<PermissionPageType[]>) => {
			const { path } = router.currentRoute.value
			const pKey = formatPermissionKey(path)
			const permission = user.getPermissions
			const keys = value.map(v => `${pKey}@${v}`)
			const hasPermission = keys.some(k => permission.includes(k))
			if (!hasPermission) {
				el.parentNode && el.parentNode.removeChild(el)
			}
		}
	})
}
