import { toast } from './toast'

export const showLoading = ref<boolean>(false)
export const showLoadingText = ref<string>('')

export const webScoket = (wsPath: string) => {
	const wsProtocol = document.location.protocol === 'https:' ? 's' : ''
	const ws = new WebSocket(`ws${wsProtocol}://${location.host}${import.meta.env.VITE_BASE_WS}/build/${wsPath}`)
	showLoading.value = true
	ws.addEventListener('message', event => {
		try {
			const result = JSON.parse(event.data)
			showLoadingText.value = result.msg
			toast(result.msg, 'success')
			if (result.code === 201) {
				showLoading.value = false
				showLoadingText.value = ''
				ws.close()
				setTimeout(() => {
					window.location.href = ''
				}, 500)
			}
		} catch (error) {
			showLoading.value = false
		}
	})
}
