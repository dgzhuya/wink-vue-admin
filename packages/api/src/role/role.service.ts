import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { Role } from './entities/role.entity'
import { BadParamsException } from '@/common/exception/bad-params-exception'
import { RolePermission } from '@/common/entities/role-permission.entity'
import { RolePermissionDto } from '@/role/dto/role-permission.dto'
import { UserRole } from '@/common/entities/user-role.entity'
import { PermissionService } from '@/permission/permission.service'

@Injectable()
export class RoleService {
	constructor(
		private readonly permissionService: PermissionService,
		@InjectRepository(Role) private readonly roleRepository: Repository<Role>,
		@InjectRepository(UserRole) private readonly userRoleRepository: Repository<UserRole>,
		@InjectRepository(RolePermission) private readonly rolePermissionRepository: Repository<RolePermission>
	) {}

	/**
	 * 创建角色
	 * @param createRoleDto 角色信息
	 */
	create(createRoleDto: CreateRoleDto) {
		return this.roleRepository.save(createRoleDto)
	}

	/**
	 * 查询所有角色
	 */
	finaAllRole() {
		return this.roleRepository.find({ select: ['id', 'title'] })
	}

	/**
	 * 查询角色列表
	 * @param skip 查询起始位置
	 * @param take 查询数量
	 * @param search 搜索条件
	 */
	async findRole(skip: number, take: number, search?: string) {
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

	/**
	 * 查询角色详情
	 * @param id 角色ID
	 */
	async findOne(id: number) {
		return await this.roleRepository.findOneBy({ id })
	}

	update(id: number, updateRoleDto: UpdateRoleDto) {
		return this.roleRepository.update(id, updateRoleDto)
	}

	/**
	 * 删除角色信息
	 * @param rid 角色ID
	 */
	async remove(rid: number) {
		const userRoles = await this.userRoleRepository.find({
			where: { roleId: rid },
			select: ['userId']
		})
		// 查看角色是否绑定了用户
		if (userRoles.length > 0) throw new BadParamsException('40014')

		// 查询角色关联的权限
		const rolePermissionIds = await this.rolePermissionRepository.find({
			where: { roleId: rid },
			select: ['id']
		})
		// 删除角色关联的权限信息
		if (rolePermissionIds.length > 0) {
			await this.rolePermissionRepository
				.createQueryBuilder()
				.delete()
				.whereInIds(rolePermissionIds.map(r => r.id))
				.execute()
		}
		return this.roleRepository.softDelete(rid)
	}

	/**
	 * 获取角色的权限信息
	 * @param rid 角色信息
	 */
	async getRolePermissions(rid: number) {
		const rolePermissions = await this.rolePermissionRepository.find({
			where: { roleId: rid },
			select: ['permissionId']
		})
		return rolePermissions.map(rp => rp.permissionId)
	}

	/**
	 * 设置角色权限
	 * @param rid 角色ID
	 * @param permissions 权限信息
	 */
	async setRolePermission({ rid, permissions }: RolePermissionDto) {
		if (permissions.length === 0) throw new BadParamsException('40010')

		// 验证角色是否存在
		const ridCount = await this.roleRepository.count({ where: { id: rid } })
		if (ridCount === 0) {
			throw new BadParamsException('40001')
		}
		// 查看权限是否存在
		const permissionCount = await this.permissionService.findPermissionCountByIds(permissions)

		if (permissionCount !== permissions.length) throw new BadParamsException('40005')

		const rolePermissions = await this.rolePermissionRepository.find({
			where: { roleId: rid },
			select: ['id', 'permissionId']
		})
		// 当前角色需要删除的关联权限信息
		const deletePermissions = rolePermissions
			.filter(permission => permissions.indexOf(permission.id) === -1)
			.map(p => p.id)
		if (deletePermissions.length > 0) {
			await this.rolePermissionRepository.createQueryBuilder().delete().whereInIds(deletePermissions).execute()
		}
		// 当前角色需要添加的关联权限信息
		const insertPermissions = permissions
			.filter(p => rolePermissions.findIndex(rp => rp.id === p) === -1)
			.map(pid => new RolePermission(rid, pid))
		if (insertPermissions.length > 0) {
			await this.rolePermissionRepository.createQueryBuilder().insert().values(insertPermissions).execute()
		}
		// 获取当前角色关联的权限信息
		return this.permissionService.findPermissionByIds(permissions)
	}

	findRoleByIds(roles: number[]) {
		return this.roleRepository.find({ where: { id: In(roles) }, select: ['id', 'title'] })
	}

	findRoleCountByIds(roles: number[]) {
		return this.roleRepository
			.createQueryBuilder('role')
			.where('role.id IN (:...roleIds)', { roleIds: roles })
			.getCount()
	}
}
