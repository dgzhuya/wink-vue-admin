import { setConfigPath } from '@/config'
import { editVueRouter } from '@/common/EditRouter'

setConfigPath({ outDir: '../api/src/', appModulePath: '../api/src/app.module.ts', outVueDir: '../web/src/' })

editVueRouter('tool', 'Tool', {
	routeIcon: 'plugin',
	routeTitle: '微信管理',
	routePath: `/tool/wechat`,
	routeName: 'ToolWechat'
})
