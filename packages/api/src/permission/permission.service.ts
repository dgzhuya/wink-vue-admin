import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import { Permission } from './entities/permission.entity'
import { BadParamsException } from '@/common/exception/bad-params-exception'
import { IsNull, Repository, TreeRepository } from 'typeorm'
import { RolePermission } from '@/common/entities/role-permission.entity'

@Injectable()
export class PermissionService {
	constructor(
		@InjectRepository(Permission) private readonly permissionRepository: TreeRepository<Permission>,
		@InjectRepository(RolePermission) private readonly rolePermissionRepository: Repository<RolePermission>
	) {}

	async create(createPermissionDto: CreatePermissionDto) {
		if (createPermissionDto.key) {
			const keyCount = await this.permissionRepository.count({ where: { key: createPermissionDto.key } })
			if (keyCount > 0) {
				throw new BadParamsException('40018')
			}
		}
		let parentPermission: Permission | null = null
		if (createPermissionDto.parentId) {
			parentPermission = await this.permissionRepository.findOne(createPermissionDto.parentId)
			if (!parentPermission) {
				throw new BadParamsException('40002')
			}
			if (!parentPermission.hasChildren) {
				await this.permissionRepository.update(parentPermission.id, { hasChildren: true })
			}
		}
		return this.permissionRepository.save({ ...createPermissionDto, parent: parentPermission })
	}

	async searchPermission(skip: number, take: number, search?: string) {
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

	async getPermissionByParent(id: number) {
		return this.permissionRepository.find({ parentId: id })
	}

	async getPermissionTree() {
		return this.permissionRepository.findTrees()
	}

	findOne(id: number) {
		return this.permissionRepository.findOne(id)
	}

	async update(id: number, updatePermissionDto: UpdatePermissionDto) {
		if (updatePermissionDto.parentId) {
			throw new BadParamsException('40005')
		}
		return this.permissionRepository.update(id, updatePermissionDto)
	}

	async remove(id: number) {
		const curPermission = await this.permissionRepository.findOne(id)
		if (curPermission.hasChildren) {
			throw new BadParamsException('40015')
		}
		const roles = await this.rolePermissionRepository.find({ where: { permissionId: id } })
		if (roles.length > 0) {
			throw new BadParamsException('40016')
		}
		if (curPermission.parentId) {
			const parentCount = await this.permissionRepository.count({ parentId: curPermission.parentId })
			if (parentCount === 1) {
				await this.permissionRepository.update(curPermission.parentId, { hasChildren: false })
			}
		}
		return this.permissionRepository.softDelete(id)
	}
}
