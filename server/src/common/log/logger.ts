import * as log4js from 'log4js'

log4js.configure({
	appenders: {
		cheese: {
			type: 'dateFile',
			filename: 'logs/application.log',
			encoding: 'utf-8',
			layout: {
				type: 'pattern',
				pattern: '{"date":"%d{yyyy/MM/dd-hh.mm.ss}","level":"%p","host":"%h","data":\'%m\'}'
			},
			pattern: 'yyyy-MM-dd',
			keepFileExt: true,
			alwaysIncludePattern: true
		}
	},
	categories: {
		default: {
			appenders: ['cheese'],
			level: 'debug'
		}
	},
	pm2: true
})

const logger = log4js.getLogger()

export { logger }
