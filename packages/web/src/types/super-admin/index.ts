export interface LoginParams {
	username: string
	password: string
}

export interface BaseModel {
	updateTime?: string
	createTime?: string
}

export interface ResetParams {
	currentPassword: string
	newPassword: string
}
