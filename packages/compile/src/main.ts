import { setConfigPath } from '@/config'
import { editVueRouter } from '@/common/EditRouter'

setConfigPath({ nestDir: '../api/src/', webDir: '../web/src/' })

editVueRouter('tool', 'Tool', {
	routeIcon: 'plugin',
	routeTitle: '微信管理',
	routePath: `/tool/wechat`,
	routeName: 'ToolWechat'
})
