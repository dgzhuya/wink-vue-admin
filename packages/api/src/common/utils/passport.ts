import { applyDecorators, SetMetadata } from '@nestjs/common'
import { NO_AUTH_TOKEN } from '@api/config/auth-config'

export const NoAuthToken = () => {
	return applyDecorators(SetMetadata(NO_AUTH_TOKEN, true))
}
