import { HttpException } from '@nestjs/common'
import { ServerError, ServerErrorErrorCode } from '@api/config/error-code'

export class BuildErrorException extends HttpException {
	constructor(code: ServerErrorErrorCode) {
		super(ServerError[code], parseInt(code))
	}
}
