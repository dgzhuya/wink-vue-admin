import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common'
import { LoginUserDto } from '@/sys/dto/login-user.dto'
import { SysService } from '@/sys/sys.service'
import { NoAuthApi, NoAuthToken } from '@/common/utils/passport'
import { TOKEN_ROLE_ID, TOKEN_USER_ID } from '@/config/auth-config'
import { BadParamsException } from '@/common/exception/bad-params-exception'
import { ResetPasswordDto } from '@/sys/dto/reset-password.dto'

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
	resetPassword(@Body() passwordDto: ResetPasswordDto, @Query(TOKEN_USER_ID) uid: string) {
		return this.sysService.resetPassword(passwordDto, +uid)
	}

	@NoAuthToken()
	@Post('login')
	login(@Body() loginUserDto: LoginUserDto) {
		return this.sysService.login(loginUserDto)
	}
}
