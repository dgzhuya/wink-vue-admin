import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import { Permission } from './entities/permission.entity'
import { BadParamsException } from '@/common/exception/bad-params-exception'
import { In, IsNull, Repository } from 'typeorm'
import { RolePermission } from '@/common/entities/role-permission.entity'

@Injectable()
export class PermissionService {
	constructor(
		@InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
		@InjectRepository(RolePermission) private readonly rolePermissionRepository: Repository<RolePermission>
	) {}

	/**
	 * 创建权限
	 * @param createPermissionDto 权限信息
	 */
	async create(createPermissionDto: CreatePermissionDto) {
		// 查询权限key是否存在
		if (createPermissionDto.key) {
			const keyCount = await this.permissionRepository.countBy({ key: createPermissionDto.key })
			if (keyCount > 0) throw new BadParamsException('40018')
		}
		// 设置父级权限信息
		if (createPermissionDto.parentId) {
			const parentPermission = await this.permissionRepository.findOneBy({ id: createPermissionDto.parentId })
			if (!parentPermission) {
				throw new BadParamsException('40002')
			}
			if (!parentPermission.hasChildren) {
				await this.permissionRepository.update(parentPermission.id, { hasChildren: true })
			}
		}
		return this.permissionRepository.save(createPermissionDto)
	}

	/**
	 * 获取权限列表
	 * @param skip 起始位置
	 * @param take 查询数量
	 * @param search 搜素关键词
	 */
	async getTablePermissions(skip: number, take: number, search?: string) {
		let queryBuilder = this.permissionRepository.createQueryBuilder('permission')
		if (search) {
			queryBuilder = queryBuilder
				.where('permission.title like :search', { search: `%${search}%` })
				.orWhere('permission.key like :search', { search: `%${search}%` })
				.orWhere('permission.description like :search', { search: `%${search}%` })
		} else {
			queryBuilder = queryBuilder.where({ parentId: IsNull() })
		}
		const [list, total] = await queryBuilder.skip(skip).take(take).getManyAndCount()
		return {
			list,
			total
		}
	}

	/**
	 * 查询父级权限下子权限
	 * @param id 权限ID
	 */
	async getPermissionByParent(id: number) {
		return this.permissionRepository.findBy({ parentId: id })
	}

	/**
	 * 获取权限树
	 * @param pid 根权限ID
	 */
	async getPermissionTree(pid?: number) {
		const permissionList = await this.permissionRepository.find({
			where: { parentId: pid || IsNull() },
			select: ['id', 'title']
		})
		const result = []
		if (permissionList.length !== 0) {
			for (let i = 0; i < permissionList.length; i++) {
				result.push({
					...permissionList[i],
					children: await this.getPermissionTree(permissionList[i].id)
				})
			}
		}
		return result
	}

	/**
	 * 查询权限详情
	 * @param id 权限ID
	 */
	findOne(id: number) {
		return this.permissionRepository.findOneBy({ id })
	}

	/**
	 * 更新权限信息
	 * @param id 权限ID
	 * @param updatePermissionDto 需要更新的信息
	 */
	async update(id: number, updatePermissionDto: UpdatePermissionDto) {
		if (updatePermissionDto.parentId) throw new BadParamsException('40005')

		if (updatePermissionDto.key) {
			// 获取当前权限信息
			const currentPermission = await this.permissionRepository.findOneBy({ id })
			// 当前权限信息key被修改后，需要检查新的key是否冲突
			if (currentPermission && currentPermission.key !== updatePermissionDto.key) {
				const keyCount = await this.permissionRepository.countBy({ key: updatePermissionDto.key })
				if (keyCount > 0) throw new BadParamsException('40018')
			}
		}
		return this.permissionRepository.update(id, updatePermissionDto)
	}

	/**
	 * 删除权限信息
	 * @param id 权限ID
	 */
	async remove(id: number) {
		const curPermission = await this.findOne(id)
		// 检查当前是否包含子权限信息
		if (curPermission.hasChildren) throw new BadParamsException('40015')

		// 检查是否有角色绑定当前权限
		const roles = await this.rolePermissionRepository.findBy({ permissionId: id })

		if (roles.length > 0) throw new BadParamsException('40016')

		// 编辑上级权限信息修改
		if (curPermission.parentId) {
			const parentCount = await this.permissionRepository.countBy({ parentId: curPermission.parentId })
			if (parentCount === 1) {
				await this.update(curPermission.parentId, { hasChildren: false })
			}
		}
		return this.permissionRepository.softDelete(id)
	}

	/**
	 * 通过ids批量获取权限信息
	 * @param permissions 权限ID列表
	 */
	findPermissionByIds(permissions: number[]) {
		return this.permissionRepository.find({ where: { id: In(permissions) }, select: ['id', 'title'] })
	}

	/**
	 * 通过ids批量获取权限数量
	 * @param permissions 权限ID列表
	 */
	async findPermissionCountByIds(permissions: number[]) {
		return this.permissionRepository
			.createQueryBuilder('permission')
			.where('permission.id IN (:...permissions)', { permissions })
			.getCount()
	}
}
