export const webScoket = (wsPath: string) => {
	const ws = new WebSocket(`ws://${location.host}${import.meta.env.VITE_BASE_WS}/build/${wsPath}`)
	ws.addEventListener('message', event => {
		console.log('Message from server ', event.data)
	})
}
