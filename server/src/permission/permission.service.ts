import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import { PermissionEntity } from './entities/permission.entity'
import { BadParamsException } from '@api/common/exception/bad-params-exception'
import { In, Repository } from 'typeorm'

@Injectable()
export class PermissionService {
	constructor(
		@InjectRepository(PermissionEntity) private readonly permissionRepository: Repository<PermissionEntity>
	) {}

	/**
	 * 创建权限
	 * @param createPermissionDto 权限信息
	 */
	async create(createPermissionDto: CreatePermissionDto) {
		if (await this.keyIsExited(createPermissionDto.key)) {
			throw new BadParamsException('40018')
		}
		const permission = await this.permissionRepository.save(createPermissionDto)

		if (createPermissionDto.parentId) {
			const parent = await this.permissionRepository.findOneBy({ id: createPermissionDto.parentId })
			if (!parent) throw new BadParamsException('40002')
			permission.parent = parent
			await this.permissionRepository.save(permission)
		}
		return permission
	}

	/**
	 * 删除权限信息
	 * @param id 权限ID
	 */
	async delete(id: number) {
		const permission = await this.permissionRepository.findOne({
			where: { id },
			relations: ['parent', 'roles', 'children']
		})

		if (permission.roles.length > 0) throw new BadParamsException('40016')

		if (permission.children.length > 0) throw new BadParamsException('40015')

		if (permission.parent) {
			const children = await this.queryChildren(permission.parent.id)
			permission.parent.children = children.filter(child => child.id !== id)
			this.permissionRepository.save(permission.parent)
		}
		return this.permissionRepository.softDelete(id)
	}

	/**
	 * 更新权限信息
	 * @param id 权限ID
	 * @param updatePermissionDto 需要更新的信息
	 */
	async update(id: number, updatePermissionDto: UpdatePermissionDto) {
		if (updatePermissionDto.key) {
			const permission = await this.permissionRepository.findOneBy({ id })
			if (permission && permission.key !== updatePermissionDto.key) {
				if (await this.keyIsExited(permission.key)) throw new BadParamsException('40018')
			}
		}
		return this.permissionRepository.update(id, updatePermissionDto)
	}

	/**
	 * 查询权限详情
	 * @param id 权限ID
	 */
	query(id: number) {
		return this.permissionRepository.findOneBy({ id })
	}

	/**
	 * 获取权限列表
	 * @param skip 起始位置
	 * @param take 查询数量
	 * @param search 搜素关键词
	 */
	async table(skip?: number, take?: number, search?: string) {
		if (skip === undefined || take === undefined) return this.permissionRepository.find()

		let queryBuilder = this.permissionRepository.createQueryBuilder('permission')
		if (search) {
			queryBuilder = queryBuilder
				.where('permission.title like :search', { search: `%${search}%` })
				.orWhere('permission.key like :search', { search: `%${search}%` })
				.orWhere('permission.description like :search', { search: `%${search}%` })
		} else {
			queryBuilder = queryBuilder.andWhere('permission.pid Is Null')
		}
		const [result, total] = await queryBuilder.skip(skip).take(take).getManyAndCount()
		const list = await this.#hasChildren(result)
		return {
			list,
			total
		}
	}

	/**
	 * 查询权限的子权限信息
	 * @param id 权限ID
	 */
	async queryChildren(id?: number, isTree = false) {
		let permissionQuery = this.permissionRepository.createQueryBuilder('permission')
		if (!id) {
			permissionQuery = permissionQuery.andWhere('permission.pid Is Null')
		} else {
			permissionQuery = permissionQuery.andWhere(`permission.pid=${id}`)
		}
		const list = await permissionQuery.getMany()

		return isTree ? list : this.#hasChildren(list)
	}

	/**
	 * 查询树形权限
	 * @param id 根权限ID
	 */
	async queryTree(id?: number) {
		const children = await this.queryChildren(id)
		const result = []
		if (children.length !== 0) {
			for (const child of children) {
				result.push({
					...child,
					children: await this.queryTree(child.id)
				})
			}
		}
		return result
	}

	/**
	 * 权限是否存在
	 * @param ids 权限是否存在
	 */
	async isExited(ids: number[]) {
		const count = await this.permissionRepository.countBy({ id: In(ids), deleteTime: null })
		return count === ids.length
	}

	/**
	 * 批量查询权限信息
	 * @param ids 权限ID集合
	 */
	async queryByIds(ids: number[]) {
		return this.permissionRepository.findBy({ id: In(ids) })
	}

	/**
	 * 通过key查询权限
	 * @param key 权限key
	 */
	findOneByKey(key: string) {
		return this.permissionRepository.findOneBy({ key })
	}

	/**
	 * 是否包含当前key的权限
	 * @param key 权限名
	 */
	async keyIsExited(key?: string) {
		return key && (await this.permissionRepository.countBy({ key, deleteTime: null })) !== 0
	}

	async #hasChildren(list: PermissionEntity[]) {
		for (let i = 0; i < list.length; i++) {
			const count = await this.permissionRepository
				.createQueryBuilder('permission')
				.andWhere(`permission.pid=${list[i].id}`)
				.getCount()
			list[i]['hasChildren'] = count > 0
		}
		return list
	}
}
