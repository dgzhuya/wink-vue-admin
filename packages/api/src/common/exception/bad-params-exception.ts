import { HttpException } from '@nestjs/common'
import { ParamsError, ParamsErrorCode } from '@/config/error-code'

export class BadParamsException extends HttpException {
	constructor(code: ParamsErrorCode) {
		super(ParamsError[code], parseInt(code))
	}
}
