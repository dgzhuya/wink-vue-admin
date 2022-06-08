import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import { Permission } from './entities/permission.entity'
import { BadParamsException } from '@/common/exception/bad-params-exception'
import { IsNull, Repository } from 'typeorm'
import { RolePermission } from '@/common/entities/role-permission.entity'

@Injectable()
export class PermissionService {
	constructor(
		@InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
		@InjectRepository(RolePermission) private readonly rolePermissionRepository: Repository<RolePermission>
	) {}

	async create(createPermissionDto: CreatePermissionDto) {
		if (createPermissionDto.key) {
			const keyCount = await this.permissionRepository.countBy({ key: createPermissionDto.key })
			if (keyCount > 0) {
				throw new BadParamsException('40018')
			}
		}
		let parentPermission: Permission | null = null
		if (createPermissionDto.parentId) {
			parentPermission = await this.permissionRepository.findOneBy({ id: createPermissionDto.parentId })
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
		return this.permissionRepository.findBy({ parentId: id })
	}

	async getPermissionTree(pid?: number) {
		const permissionList = pid
			? await this.permissionRepository.find({
					where: { parentId: pid },
					select: ['id', 'title']
			  })
			: await this.permissionRepository.find({
					where: { parentId: IsNull() },
					select: ['id', 'title']
			  })
		const result = []
		if (permissionList.length !== 0) {
			for (let i = 0; i < permissionList.length; i++) {
				const { id, title } = permissionList[i]
				const children = await this.getPermissionTree(id)
				result.push({
					id,
					title,
					children
				})
			}
		}
		return result
	}

	findOne(id: number) {
		return this.permissionRepository.findOneBy({ id })
	}

	async update(id: number, updatePermissionDto: UpdatePermissionDto) {
		if (updatePermissionDto.parentId) {
			throw new BadParamsException('40005')
		}
		return this.permissionRepository.update(id, updatePermissionDto)
	}

	async remove(id: number) {
		const curPermission = await this.permissionRepository.findOneBy({ id })
		if (curPermission.hasChildren) {
			throw new BadParamsException('40015')
		}
		const roles = await this.rolePermissionRepository.findBy({ permissionId: id })
		if (roles.length > 0) {
			throw new BadParamsException('40016')
		}
		if (curPermission.parentId) {
			const parentCount = await this.permissionRepository.countBy({ parentId: curPermission.parentId })
			if (parentCount === 1) {
				await this.permissionRepository.update(curPermission.parentId, { hasChildren: false })
			}
		}
		return this.permissionRepository.softDelete(id)
	}
}
