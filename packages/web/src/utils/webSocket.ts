import { toast } from './toast'

export const showLoading = ref<boolean>(false)

export const webScoket = (wsPath: string) => {
	const wsProtocol = document.location.protocol === 'https:' ? 's' : ''
	const ws = new WebSocket(`ws${wsProtocol}://${location.host}${import.meta.env.VITE_BASE_WS}/build/${wsPath}`)
	showLoading.value = true
	ws.addEventListener('message', event => {
		try {
			const result = JSON.parse(event.data)
			if (result.code === 201) {
				showLoading.value = false
				ws.close()
				toast(result.msg, 'success')
				setTimeout(() => {
					window.location.href = ''
				}, 2000)
			} else {
				toast(`开始${result.msg}`, 'success')
			}
		} catch (error) {
			showLoading.value = false
		}
	})
}
