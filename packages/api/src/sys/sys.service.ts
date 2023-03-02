import { Injectable } from '@nestjs/common'
import { compareSync, hash } from 'bcryptjs'
import { LoginUserDto } from '@/sys/dto/login-user.dto'
import { sign } from 'jsonwebtoken'
import { JwtSalt } from '@/config/jwt-config'
import { BadParamsException } from '@/common/exception/bad-params-exception'
import { ResetPasswordDto } from '@/sys/dto/reset-password.dto'
import { UserService } from '@/user/user.service'
import { RoleService } from '@/role/role.service'

@Injectable()
export class SysService {
	constructor(private readonly userService: UserService, private readonly roleService: RoleService) {}

	async login(loginDto: LoginUserDto) {
		const user = await this.userService.queryByName(loginDto.username)
		if (!user) throw new BadParamsException('40006')

		if (!compareSync(loginDto.password, user.password)) {
			throw new BadParamsException('40007')
		}

		if (!user.major || !(await this.roleService.isExited([user.major]))) {
			throw new BadParamsException('40012')
		}

		return {
			token: sign({ uid: `${user.id}`, rid: `${user.major}` }, JwtSalt, {
				expiresIn: '10h'
			})
		}
	}

	/**
	 * 重置密码
	 * @param uid 用户ID
	 * @param resetPasswordDto 用户密码信息
	 */
	async resetPassword(uid: number, resetPasswordDto: ResetPasswordDto) {
		if (!(await this.userService.isExited([uid]))) {
			throw new BadParamsException('40006')
		}

		const user = await this.userService.query(uid)
		if (!user) throw new BadParamsException('40006')

		if (!compareSync(resetPasswordDto.currentPassword, user.password)) {
			throw new BadParamsException('40007')
		}

		return this.userService.updatePasswd(uid, await hash(resetPasswordDto.newPassword, 10))
	}

	/**
	 * 切换用户角色
	 * @param uid 用户ID
	 * @param rid 角色ID
	 */
	async toggleUserRole(uid: number, rid: number) {
		if (!(await this.userService.isExited([uid]))) {
			throw new BadParamsException('40006')
		}
		if (!(await this.roleService.isExited([rid]))) {
			throw new BadParamsException('40001')
		}
		const role = await this.roleService.query(rid)
		return {
			permission: role.permissions.map(pr => pr.key),
			token: sign({ uid: `${uid}`, rid: `${rid}` }, JwtSalt, {
				expiresIn: '5d'
			})
		}
	}

	/**
	 * 获取用户登录信息
	 * @param uid 用户ID
	 * @param rid 角色ID
	 */
	async getProfile(uid: number, rid: number) {
		if (!(await this.userService.isExited([uid]))) {
			throw new BadParamsException('40006')
		}
		if (!(await this.roleService.isExited([rid]))) {
			throw new BadParamsException('40001')
		}

		const user = await this.userService.query(uid)
		const role = await this.roleService.query(rid)
		const permissions = role.permissions

		return {
			...user,
			permissions: permissions.map(p => p.key)
		}
	}
}
