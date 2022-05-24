import { Injectable } from '@nestjs/common'
import { compareSync } from 'bcryptjs'
import { LoginUserDto } from '@/sys/dto/login-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '@/user/entities/user.entity'
import { IsNull, Not, Repository } from 'typeorm'
import { sign } from 'jsonwebtoken'
import { JwtSalt } from '@/config/jwt-config'
import { Role } from '@/role/entities/role.entity'
import { BadParamsException } from '@/common/exception/bad-params-exception'
import { Permission } from '@/permission/entities/permission.entity'
import { UserRole } from '@/common/entities/user-role.entity'
import { RolePermission } from '@/common/entities/role-permission.entity'
import { filter } from '@/common/utils/filter'

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
		const user = await this.userRepository.findOne({ username: loginDto.username })
		if (user === undefined) {
			throw new BadParamsException('40006')
		}
		const result = compareSync(loginDto.password, user.password)
		if (!result) {
			throw new BadParamsException('40007')
		}
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
				expiresIn: '5d'
			})
		}
	}

	async toggleUserRole(uid: number, rid: number) {
		const rolePermissions = await this.rolePermissionRepository.find({
			where: { roleId: rid },
			select: ['permissionId']
		})
		const permissionsResult = await this.permissionRepository.findByIds(
			rolePermissions.map(p => p.permissionId),
			{ select: ['key'], where: { key: Not(IsNull()) }, order: { createTime: 'DESC' } }
		)
		return {
			permission: permissionsResult.map(pr => pr.key),
			token: sign({ uid: `${uid}`, rid: `${rid}` }, JwtSalt, {
				expiresIn: '5d'
			})
		}
	}

	async getProfile(uid: number, rid: number) {
		const user = await this.userRepository.findOne({ id: uid })
		let permissions = []
		let roles: Role[] = []

		const userRoles = await this.userRoleRepository.find({ where: { userId: uid } })
		if (userRoles.length > 0) {
			roles = await this.roleRepository.findByIds(
				userRoles.map(ur => ur.roleId),
				{ select: ['title', 'id'] }
			)
		}

		const userMajorPermissions = await this.rolePermissionRepository.find({
			where: { roleId: rid },
			select: ['permissionId']
		})
		if (userMajorPermissions.length > 0) {
			const permissionResult = await this.permissionRepository.findByIds(
				userMajorPermissions.map(p => p.permissionId),
				{ select: ['key'], where: { key: Not(IsNull()) }, order: { createTime: 'DESC' } }
			)
			permissions = permissionResult.map(pr => pr.key)
		}

		return {
			...filter(user, key => key !== 'password'),
			majorId: uid,
			permissions,
			roles
		}
	}
}
