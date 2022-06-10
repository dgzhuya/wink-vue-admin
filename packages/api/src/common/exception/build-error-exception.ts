import { HttpException } from '@nestjs/common'
import { ServerError, ServerErrorErrorCode } from '@/config/error-code'

export class BuildErrorException extends HttpException {
	constructor(code: ServerErrorErrorCode) {
		super(ServerError[code], parseInt(code))
	}
}
