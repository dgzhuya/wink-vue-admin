import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { Role } from './entities/role.entity'
import { BadParamsException } from '@/common/exception/bad-params-exception'
import { Permission } from '@/permission/entities/permission.entity'
import { RolePermission } from '@/common/entities/role-permission.entity'
import { RolePermissionDto } from '@/role/dto/role-permission.dto'
import { UserRole } from '@/common/entities/user-role.entity'
import { isNotNull } from '@/common/utils/isNotNull'

@Injectable()
export class RoleService {
	constructor(
		@InjectRepository(Role) private readonly roleRepository: Repository<Role>,
		@InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
		@InjectRepository(UserRole) private readonly userRoleRepository: Repository<UserRole>,
		@InjectRepository(RolePermission) private readonly rolePermissionRepository: Repository<RolePermission>
	) {}

	create(createRoleDto: CreateRoleDto) {
		return this.roleRepository.save(createRoleDto)
	}

	finaAllRole() {
		return this.roleRepository.find({ select: ['id', 'title'] })
	}

	async findRole(skip?: number, take?: number, search?: string) {
		if (isNotNull(skip) && isNotNull(take)) {
			let queryBuilder = this.roleRepository.createQueryBuilder('role')
			if (search) {
				queryBuilder = queryBuilder
					.where('role.title like :search', { search: `%${search}%` })
					.orWhere('role.description like :search', { search: `%${search}%` })
			}
			const [list, total] = await queryBuilder.skip(skip).take(take).getManyAndCount()
			return {
				list,
				total
			}
		}
		return await this.roleRepository.find({ select: ['id', 'title'] })
	}

	async findOne(id: number) {
		return await this.roleRepository.findOne(id)
	}

	update(id: number, updateRoleDto: UpdateRoleDto) {
		return this.roleRepository.update(id, updateRoleDto)
	}

	async remove(rid: number) {
		const userRoles = await this.userRoleRepository.find({
			where: { roleId: rid },
			select: ['userId']
		})
		if (userRoles.length > 0) {
			throw new BadParamsException('40014')
		}
		const rolePermissionIds = await this.rolePermissionRepository.find({
			where: { roleId: rid },
			select: ['id']
		})
		if (rolePermissionIds.length > 0) {
			await this.rolePermissionRepository
				.createQueryBuilder()
				.delete()
				.whereInIds(rolePermissionIds.map(r => r.id))
				.execute()
		}
		return this.roleRepository.softDelete(rid)
	}

	async getRolePermissions(rid: number) {
		const rolePermissions = await this.rolePermissionRepository.find({
			where: { roleId: rid },
			select: ['permissionId']
		})
		return rolePermissions.map(rp => rp.permissionId)
	}

	async setRolePermission({ rid, permissions }: RolePermissionDto) {
		if (permissions.length === 0) {
			throw new BadParamsException('40010')
		} else {
			const ridCount = await this.roleRepository.count({ id: rid })
			if (ridCount === 0) {
				throw new BadParamsException('40001')
			}
			const permissionCount = await this.permissionRepository
				.createQueryBuilder('permission')
				.where('permission.id IN (:...permissions)', { permissions })
				.getCount()

			if (permissionCount !== permissions.length) {
				throw new BadParamsException('40005')
			}

			const rolePermissions = await this.rolePermissionRepository.find({
				where: { roleId: rid },
				select: ['id', 'permissionId']
			})
			const deletePermissions = rolePermissions
				.filter(permission => permissions.indexOf(permission.id) === -1)
				.map(p => p.id)
			const insertPermissions = permissions
				.filter(p => rolePermissions.findIndex(rp => rp.id === p) === -1)
				.map(pid => new RolePermission(rid, pid))
			if (deletePermissions.length > 0) {
				await this.rolePermissionRepository
					.createQueryBuilder()
					.delete()
					.whereInIds(deletePermissions)
					.execute()
			}
			if (insertPermissions.length > 0) {
				await this.rolePermissionRepository.createQueryBuilder().insert().values(insertPermissions).execute()
			}
			return this.permissionRepository.findByIds(permissions, { select: ['id', 'title'] })
		}
	}
}
