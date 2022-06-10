import { WebSocketServer } from 'ws'
import shell from 'shelljs'
import path from 'path'

const wss = new WebSocketServer({ port: 8081 })

let codePath = ''
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
		if (data && process.env.WS_KEY && data.key === process.env.WS_KEY && data.codePath) {
			codePath = data.codePath
		}
	})
})
