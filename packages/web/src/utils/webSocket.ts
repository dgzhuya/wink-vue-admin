export const webScoket = (wsPath: string) => {
	const wsProtocol = document.location.protocol === 'https:' ? 's' : ''
	const ws = new WebSocket(`ws${wsProtocol}://${location.host}${import.meta.env.VITE_BASE_WS}/build/${wsPath}`)
	ws.addEventListener('message', event => {
		console.log('Message from server ', event.data)
	})
}
