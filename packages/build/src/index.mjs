import { WebSocketServer } from 'ws'
import shell from 'shelljs'
import path from 'path'

const wss = new WebSocketServer({ port: 9527 })

let codePath = 'hello'
wss.on('connection', (ws, request) => {
	if (codePath !== '' && request.url === `/build/${codePath}`) {
		codePath = ''
		ws.send(JSON.stringify({ code: 200, msg: '开始编译' }))
		console.log(path.resolve(path.dirname(''), ''))
		shell.cd('../api')
		shell.exec('npm run build')
		ws.send(JSON.stringify({ code: 200, msg: 'Node编译成功' }))
		shell.cd('../web')
		shell.exec('npm run build:prod')
		ws.send(JSON.stringify({ code: 200, msg: '前端页面编译成功' }))
		shell.exec('pm2 restart wink-api')
		ws.send(JSON.stringify({ code: 200, msg: '项目重启成功,即将自动刷新' }))
	}
	ws.on('message', data => {
		try {
			const resultData = JSON.parse(data.toString())
			if (resultData && process.env.WS_KEY && resultData.key === process.env.WS_KEY && resultData.codePath) {
				codePath = data.codePath
				ws.send(JSON.stringify({ code: 200 }))
			}
		} catch (error) {
			console.log('error:', error)
			ws.send(JSON.stringify({ code: 500 }))
		}
	})
})
