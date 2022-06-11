import { WebSocketServer } from 'ws'
import shell from 'shelljs'
import fs from 'fs'

const wss = new WebSocketServer({ port: 9527 })

let codePath = ''
wss.on('connection', (ws, request) => {
	if (codePath !== '' && request.url === `/build/${codePath}`) {
		codePath = ''
		ws.send(JSON.stringify({ code: 200, msg: '编译API' }))
		shell.cd('../api')
		shell.exec('npm run build')
		ws.send(JSON.stringify({ code: 200, msg: '编译web' }))
		shell.cd('../web')
		shell.exec('npm run build:prod')
		if (fs.existsSync('/var/www/admin_web')) {
			shell.rm(
				'-rf',
				'/var/www/admin_web/assets',
				'/var/www/admin_web/favicon.ico',
				'/var/www/admin_web/index.html'
			)
			shell.cp('-r', './dist/*', '/var/www/admin_web/')
		}
		ws.send(JSON.stringify({ code: 200, msg: '重启项目' }))
		shell.exec('pm2 restart wink-api')
		ws.send(JSON.stringify({ code: 201, msg: '页面刷新' }))
	}
	ws.on('message', data => {
		try {
			const resultData = JSON.parse(data.toString())
			if (resultData && process.env.WS_KEY && resultData.key === process.env.WS_KEY && resultData.codePath) {
				codePath = resultData.codePath
				ws.send(JSON.stringify({ code: 200 }))
			}
		} catch (error) {
			console.log('error:', error)
			ws.send(JSON.stringify({ code: 500 }))
		}
	})
})
