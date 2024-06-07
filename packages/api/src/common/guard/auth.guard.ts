import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Request } from 'express'
import { verify } from 'jsonwebtoken'
import { JwtSalt } from '@api/config/jwt-config'
import { logger } from '@api/common/log/logger'
import { NO_AUTH_API, NO_AUTH_TOKEN, TOKEN_ROLE_ID, TOKEN_USER_ID } from '@api/config/auth-config'
import { BadParamsException } from '@api/common/exception/bad-params-exception'

@Injectable()
export class AuthGuard implements CanActivate {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		if (Reflect.getMetadata(NO_AUTH_TOKEN, context.getHandler())) return true

		const { headers, query } = context.switchToHttp().getRequest<Request>()
		if (!headers.authorization) {
			throw new BadParamsException('40008')
		}
		try {
			const payload = (await this.verifyToken(headers.authorization)) as { uid: string; rid: string }
			query[TOKEN_USER_ID] = payload.uid
			query[TOKEN_ROLE_ID] = payload.rid
			if (Reflect.getMetadata(NO_AUTH_API, context.getHandler())) return true
		} catch (e) {
			logger.error(e)
			throw new BadParamsException('401')
		}
		return true
	}

	private async verifyToken(token: string) {
		return new Promise((resolve, reject) => {
			verify(token, JwtSalt, (err, payload) => {
				if (err) {
					reject(err)
				} else {
					resolve(payload)
				}
			})
		})
	}
}
