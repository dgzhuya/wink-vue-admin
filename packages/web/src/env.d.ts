/// <reference types="vite/client" />

declare module '*.vue' {
	import type { DefineComponent } from 'vue'
	const component: DefineComponent<{}, {}, any>
	export default componnt
}

interface ImportMetaEnv {
	VITE_BASE_URL: string
}
