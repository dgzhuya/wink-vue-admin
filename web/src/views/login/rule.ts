const validatePassword = () => {
	return (rule: any, value: string, callback: any) => {
		if (value.length < 6) {
			callback(new Error('密码不能少于6位'))
		} else {
			callback()
		}
	}
}

export const loginRules = ref({
	username: [
		{
			required: true,
			tigger: 'blur',
			message: '用户名必须填'
		}
	],
	password: [
		{
			required: true,
			tigger: 'blur',
			validator: validatePassword()
		}
	]
})

export const passwordType = ref<'text' | 'password'>('password')
