import { applyDecorators, SetMetadata } from '@nestjs/common'
import { NO_AUTH_API, NO_AUTH_TOKEN } from '@/config/auth-config'

export const NoAuthToken = () => {
	return applyDecorators(SetMetadata(NO_AUTH_TOKEN, true))
}

export const NoAuthApi = () => {
	return applyDecorators(SetMetadata(NO_AUTH_API, true))
}
