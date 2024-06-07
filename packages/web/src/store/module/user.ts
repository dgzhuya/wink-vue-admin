import { getUserInfo, login } from '@web/api'
import { LoginParams } from '@web/types/super-admin'
import { defineStore } from 'pinia'
import { FormInstance } from 'element-plus'
import { getItem, removeItem, setItem } from '@web/utils/store'
import router from '@web/router'
import { StoreUserInfo } from '@web/types'

const TOKEN_KEY = 'token'

export const useUser = defineStore('userInfo', {
	state: () => {
		return {
			user: {} as StoreUserInfo,
			loading: false,
			token: getItem(TOKEN_KEY)
		}
	},
	getters: {
		getLoading: state => state.loading,
		hasUserInfo: state => state.user && state.user.id !== undefined,
		info: state => state.user,
		getToken: state => state.token,
		getPermissions: state => (state.user.permissions ? state.user.permissions : [])
	},
	actions: {
		loginout() {
			this.$state.token = ''
			router.push('/login').then(() => {
				if (this.$state.user.permissions) {
					this.$state.user.permissions.forEach(route => router.hasRoute(route) && router.removeRoute(route))
				}
				router.removeRoute('404')
				this.$state.user = {}
				removeItem(TOKEN_KEY)
			})
		},
		async fetchUserInfo() {
			const res = await getUserInfo()
			this.$state.user = res
		},
		async login(formEl: FormInstance | undefined, userInfo: LoginParams) {
			if (!formEl) return
			try {
				const valid = await formEl.validate(v => v)
				if (!valid) return
				this.$state.loading = true
				const res = await login({
					username: userInfo.username,
					password: userInfo.password
				})
				if (res.token) {
					this.$state.token = res.token
					setItem(TOKEN_KEY, res.token)
				}
				this.$state.loading = false
				router.push('/')
			} catch (error) {
				this.$state.loading = false
			}
		}
	}
})
