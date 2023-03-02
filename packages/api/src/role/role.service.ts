import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { RoleEntity } from './entities/role.entity'
import { BadParamsException } from '@/common/exception/bad-params-exception'
import { RolePermissionDto } from '@/role/dto/role-permission.dto'
import { PermissionService } from '@/permission/permission.service'

@Injectable()
export class RoleService {
	constructor(
		private readonly permissionService: PermissionService,
		@InjectRepository(RoleEntity) private readonly roleRepository: Repository<RoleEntity>
	) {}

	/**
	 * 创建角色
	 * @param createRoleDto 角色信息
	 */
	create(createRoleDto: CreateRoleDto) {
		return this.roleRepository.save(createRoleDto)
	}

	/**
	 * 删除角色信息
	 * @param id 角色ID
	 */
	async delete(id: number) {
		const role = await this.roleRepository.findOneBy({ id })

		if (role.users.length > 0) throw new BadParamsException('40014')

		if (role.permissions.length > 0) {
			await this.roleRepository.update(id, { permissions: [] })
		}
		return this.roleRepository.softDelete(id)
	}

	/**
	 * 更新角色信息
	 * @param id 角色ID
	 * @param updateRoleDto 角色更新信息
	 */
	update(id: number, updateRoleDto: UpdateRoleDto) {
		return this.roleRepository.update(id, updateRoleDto)
	}

	/**
	 * 查询角色详情
	 * @param id 角色ID
	 */
	query(id: number) {
		return this.roleRepository.findOneBy({ id })
	}

	/**
	 * 查询角色列表
	 * @param skip 查询起始位置
	 * @param take 查询数量
	 * @param search 搜索条件
	 */
	async table(skip?: number, take?: number, search?: string) {
		if (skip === undefined || take === undefined) return this.roleRepository.find()

		let queryBuilder = this.roleRepository.createQueryBuilder('role')
		if (search) {
			queryBuilder = queryBuilder
				.where('role.title like :search', { search: `%${search}%` })
				.orWhere('role.description like :search', { search: `%${search}%` })
		}
		const [list, total] = await queryBuilder.skip(skip).take(take).getManyAndCount()
		return { list, total }
	}

	/**
	 * 获取角色的权限信息
	 * @param id 角色ID
	 */
	async getPermissions(id: number) {
		const role = await this.roleRepository.findOne({ where: { id }, select: ['permissions'] })
		return role.permissions
	}

	/**
	 * 设置角色权限
	 * @param is 角色ID
	 * @param pIds 权限信息
	 */
	async setPermission({ id, pIds }: RolePermissionDto) {
		const role = await this.roleRepository.findOneBy({ id })
		if (!role) throw new BadParamsException('40001')

		if (pIds.length === 0) throw new BadParamsException('40010')

		const ridCount = await this.roleRepository.countBy({ id: id })
		if (ridCount === 0) {
			throw new BadParamsException('40001')
		}

		if (await this.permissionService.isExited(pIds)) throw new BadParamsException('40005')

		const permissions = await this.permissionService.queryByIds(pIds)
		await this.roleRepository.update(id, { permissions })

		return permissions
	}

	/**
	 * 通过角色id列表查询角色信息
	 * @param ids 角色id集合
	 */
	queryByIds(ids: number[]) {
		return this.roleRepository.find({
			where: {
				id: In(ids)
			},
			select: ['id', 'title', 'description']
		})
	}

	/**
	 * 检查角色是否存在
	 * @param ids 角色id集合
	 */
	async isExited(ids: number[]) {
		const count = await this.roleRepository.countBy({ id: In(ids), deleteTime: null })
		return count === ids.length
	}
}
