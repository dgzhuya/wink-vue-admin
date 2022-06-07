export interface PluginDto {
	name?: string
	description?: string
	url?: string
}

export interface PluginModel {
	id: number
	name: string
	url: string
	description: string
	createTime: string
	updateTime: string
}
