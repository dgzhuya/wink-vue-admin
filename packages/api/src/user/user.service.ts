import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserEntity } from './entities/user.entity'
import { RoleEntity } from '@/role/entities/role.entity'
import { BadParamsException } from '@/common/exception/bad-params-exception'
import { UserRole } from '@/common/entities/user-role.entity'
import { UserRoleDto, UserRolesDto } from '@/user/dto/user-role.dto'
import { filterObj } from '@/common/utils/filterObj'
import { RoleService } from '@/role/role.service'

@Injectable()
export class UserService {
	constructor(
		private readonly roleService: RoleService,
		@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
	) {}

	/**
	 * 创建用户
	 * @param createUserDto 用户信息
	 */
	async create(createUserDto: CreateUserDto) {
		const count = await this.userRepository.countBy({ username: createUserDto.username })
		if (count !== 0) throw new BadParamsException('40009')
		return this.userRepository.save(Object.assign(new UserEntity(), createUserDto))
	}

	/**
	 * 删除用户
	 * @param id 用户ID
	 */
	async delete(id: number) {
		const user = await this.userRepository.findOneBy({ id })

		const roles = await user.roles
		if (roles.length > 0) {
			await this.userRepository.update(id, { roles: Promise.resolve([]) })
		}
		return this.userRepository.softDelete({ id })
	}

	/**
	 * 更新用户信息
	 * @param id 用户ID
	 * @param updateUserDto 需要更新的数据
	 */
	update(id: number, updateUserDto: UpdateUserDto) {
		return this.userRepository.update(id, updateUserDto)
	}

	/**
	 * 查询用户详情
	 * @param id 用户ID
	 */
	async query(id: number) {
		return await this.userRepository.findOneBy({ id })
	}

	/**
	 * 搜索用户信息
	 * @param skip 查询起始位置
	 * @param take 查询数量
	 * @param search 搜索关键词
	 */
	async table(skip?: number, take?: number, search?: string) {
		if (skip === undefined || take === undefined) return this.userRepository.find()

		let queryBuilder = this.userRepository
			.createQueryBuilder('user')
			.leftJoinAndMapMany('user.majors', UserRole, 'user_role', 'user_role.userId = user.id')
			.leftJoinAndMapMany('user.roles', RoleEntity, 'role', 'role.id = user_role.roleId')
		if (search) {
			queryBuilder = queryBuilder
				.where('user.username like :search', { search: `%${search}%` })
				.orWhere('user.nickname like :search', { search: `%${search}%` })
		}
		const [list, total] = await queryBuilder.take(take).skip(skip).getManyAndCount()
		return {
			total,
			list: list.map((user: any) => {
				const major = user.majors.filter(m => m.isMajor)
				const roles = user.roles.map(r => ({ id: r.id, title: r.title }))
				const roleIds = roles.map(r => r.id)
				return {
					majorId: major.length > 0 ? major[0].roleId : null,
					...filterObj(user, key => key !== 'password' && key !== 'majors'),
					roles,
					roleIds
				}
			})
		}
	}

	/**
	 * 查看用户是否存在
	 * @param ids 用户ID列表
	 */
	async isExited(ids: number[]) {
		const count = await this.userRepository.countBy({ id: In(ids), deleteTime: null })
		return count === ids.length
	}

	/**
	 * 通过用户名查询用户信息
	 * @param username 用户名
	 */
	queryByName(username: string) {
		const user = this.userRepository.findOneBy({ username })
		return user
	}

	/**
	 * 重置用户密码
	 * @param id 用户ID
	 * @param password 新密码
	 */
	updatePasswd(id: number, password: string) {
		return this.userRepository.update(id, { password })
	}

	/**
	 * 设置用户角色
	 * @param uid 用户ID
	 * @param rIds 角色列表
	 */
	async setRoles({ id, rIds }: UserRolesDto) {
		const user = await this.userRepository.findOne({ where: { id }, select: ['major'] })
		if (!user) throw new BadParamsException('40006')

		if (rIds.length === 0) throw new BadParamsException('40010')
		if (await this.roleService.isExited(rIds)) throw new BadParamsException('40001')

		const roles = await this.roleService.queryByIds(rIds)
		if (!user.major || !rIds.includes(user.major)) {
			await this.userRepository.update(id, { major: rIds[0] })
		}
		await this.userRepository.update(id, { roles: Promise.resolve(roles) })
		return roles
	}

	/**
	 * 设置用户主要角色
	 * @param uid 用户ID
	 * @param rid 角色ID
	 */
	async setMajorRole({ id, rid }: UserRoleDto) {
		const user = await this.userRepository.findOneBy({ id })
		if (!user) throw new BadParamsException('40006')
		if (await this.roleService.isExited([rid])) throw new BadParamsException('40001')
		return this.userRepository.update(id, { major: rid })
	}
}
