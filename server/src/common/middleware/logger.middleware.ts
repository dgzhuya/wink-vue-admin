import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'
import { logger } from '../log/logger'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: () => void) {
		const { path, method, body, params, ip } = req
		const bodyStr = Object.keys(body).length > 0 ? ',body=' + JSON.stringify(body) : ''
		const paramsStr = Object.keys(params).length > 0 ? ',params=' + JSON.stringify(params) : ''
		logger.info(`ip=${ip},path=${path},method=${method}${bodyStr}${paramsStr}`)
		next()
	}
}
