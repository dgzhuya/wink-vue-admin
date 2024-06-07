import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common'
import { LoginUserDto } from '@api/sys/dto/login-user.dto'
import { SysService } from '@api/sys/sys.service'
import { NoAuthApi, NoAuthToken } from '@api/common/utils/passport'
import { TOKEN_ROLE_ID, TOKEN_USER_ID } from '@api/config/auth-config'
import { BadParamsException } from '@api/common/exception/bad-params-exception'
import { ResetPasswordDto } from '@api/sys/dto/reset-password.dto'

@Controller('sys')
export class SysController {
	constructor(private readonly sysService: SysService) {}

	@Get('profile')
	getProfile(@Query(TOKEN_USER_ID) uid: string, @Query(TOKEN_ROLE_ID) rid: string) {
		return this.sysService.getProfile(+uid, +rid)
	}

	@NoAuthApi()
	@Get(':rid')
	toggleUserRole(
		@Query(TOKEN_USER_ID) uid: string,
		@Query(TOKEN_ROLE_ID) tokenRid: string,
		@Param('rid') rid: string
	) {
		if (tokenRid === rid) {
			throw new BadParamsException('40013')
		}
		return this.sysService.toggleUserRole(+uid, +rid)
	}

	@Post('password')
	resetPassword(@Query(TOKEN_USER_ID) uid: string, @Body() passwordDto: ResetPasswordDto) {
		return this.sysService.resetPassword(+uid, passwordDto)
	}

	@NoAuthToken()
	@Post('login')
	login(@Body() loginUserDto: LoginUserDto) {
		return this.sysService.login(loginUserDto)
	}
}
