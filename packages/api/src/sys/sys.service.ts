import { Injectable } from '@nestjs/common'
import { compareSync, hash } from 'bcryptjs'
import { LoginUserDto } from '@/sys/dto/login-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '@/user/entities/user.entity'
import { In, IsNull, Not, Repository } from 'typeorm'
import { sign } from 'jsonwebtoken'
import { JwtSalt } from '@/config/jwt-config'
import { Role } from '@/role/entities/role.entity'
import { BadParamsException } from '@/common/exception/bad-params-exception'
import { Permission } from '@/permission/entities/permission.entity'
import { UserRole } from '@/common/entities/user-role.entity'
import { RolePermission } from '@/common/entities/role-permission.entity'
import { filterObj } from '@/common/utils/filterObj'
import { ResetPasswordDto } from '@/sys/dto/reset-password.dto'

@Injectable()
export class SysService {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		@InjectRepository(Role) private readonly roleRepository: Repository<Role>,
		@InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
		@InjectRepository(UserRole) private readonly userRoleRepository: Repository<UserRole>,
		@InjectRepository(RolePermission) private readonly rolePermissionRepository: Repository<RolePermission>
	) {}

	async login(loginDto: LoginUserDto) {
		const user = await this.userRepository.findOneBy({ username: loginDto.username })
		if (!user) throw new BadParamsException('40006')
		const result = compareSync(loginDto.password, user.password)
		if (!result) throw new BadParamsException('40007')

		const userRole = await this.userRoleRepository.findOne({
			where: {
				userId: user.id,
				isMajor: true
			},
			select: ['roleId']
		})
		if (!userRole) {
			throw new BadParamsException('40012')
		}
		return {
			token: sign({ uid: `${user.id}`, rid: `${userRole.roleId}` }, JwtSalt, {
				expiresIn: '10h'
			})
		}
	}

	async resetPassword(resetPasswordDto: ResetPasswordDto, uid: number) {
		const user = await this.userRepository.findOneBy({ id: uid })
		if (!user) throw new BadParamsException('40006')
		const result = compareSync(resetPasswordDto.currentPassword, user.password)
		if (!result) throw new BadParamsException('40007')
		const newPassword = await hash(resetPasswordDto.newPassword, 10)
		return this.userRepository.update(uid, { password: newPassword })
	}

	async toggleUserRole(uid: number, rid: number) {
		const rolePermissions = await this.rolePermissionRepository.find({
			where: { roleId: rid },
			select: ['permissionId']
		})
		const permissionsResult = await this.permissionRepository.find({
			select: ['key'],
			where: { key: Not(IsNull()), id: In(rolePermissions.map(p => p.permissionId)) },
			order: { createTime: 'DESC' }
		})
		return {
			permission: permissionsResult.map(pr => pr.key),
			token: sign({ uid: `${uid}`, rid: `${rid}` }, JwtSalt, {
				expiresIn: '5d'
			})
		}
	}

	async getProfile(uid: number, rid: number) {
		const user = await this.userRepository.findOneBy({ id: uid })
		let permissions = []
		let roles: Role[] = []

		const userRoles = await this.userRoleRepository.find({ where: { userId: uid } })
		if (userRoles.length > 0) {
			roles = await this.roleRepository.find({
				select: ['title', 'id'],
				where: { id: In(userRoles.map(ur => ur.roleId)) }
			})
		}

		const userMajorPermissions = await this.rolePermissionRepository.find({
			where: { roleId: rid },
			select: ['permissionId']
		})
		if (userMajorPermissions.length > 0) {
			const permissionResult = await this.permissionRepository.find({
				select: ['key'],
				where: { key: Not(IsNull()), id: In(userMajorPermissions.map(p => p.permissionId)) },
				order: { createTime: 'DESC' }
			})
			permissions = permissionResult.map(pr => pr.key)
		}

		return {
			...filterObj(user, key => key !== 'password'),
			majorId: rid,
			permissions,
			roles
		}
	}
}
