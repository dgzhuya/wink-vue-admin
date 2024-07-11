import 'vue-router'

declare module 'vue-router' {
	interface RouteMeta {
		title: string
		icon?: string
		noAuth?: boolean
		hidden?: boolean
	}
}

declare module '*.scss' {
	const content: { [className: string]: string }
	export = content
}

declare module 'axios' {
	export interface AxiosRequestConfig {
		noLoading?: boolean
	}
}
