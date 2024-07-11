/// <reference types="vite/client" />
import { ObjectDirective } from 'vue'

declare module '*.vue' {
	import type { DefineComponent } from 'vue'
	const component: DefineComponent<{}, {}, any>
	export default componnt
}

type PagePermissionType = 'update' | 'set' | 'delete' | 'add'

declare module 'vue' {
	interface ComponentCustomProperties {
		vPermission: ObjectDirective<HTMLElement, PagePermissionType[]>
	}
}

interface ImportMetaEnv {
	VITE_BASE_URL: string
	VITE_BASE_WS: string
}
