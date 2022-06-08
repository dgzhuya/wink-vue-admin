import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { Role } from '@/role/entities/role.entity'
import { BadParamsException } from '@/common/exception/bad-params-exception'
import { UserRole } from '@/common/entities/user-role.entity'
import { UserRoleDto, UserRolesDto } from '@/user/dto/user-role.dto'
import { filter } from '@/common/utils/filter'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		@InjectRepository(Role) private readonly roleRepository: Repository<Role>,
		@InjectRepository(UserRole) private readonly userRoleRepository: Repository<UserRole>
	) {}

	async create(createUserDto: CreateUserDto) {
		const count = await this.userRepository.countBy({ username: createUserDto.username })
		if (count !== 0) {
			throw new BadParamsException('40009')
		}
		return this.userRepository.save(Object.assign(new User(), createUserDto))
	}

	async searchUser(skip: number, take: number, search?: string) {
		let queryBuilder = this.userRepository
			.createQueryBuilder('user')
			.leftJoinAndMapMany('user.majors', UserRole, 'user_role', 'user_role.userId = user.id')
			.leftJoinAndMapMany('user.roles', Role, 'role', 'role.id = user_role.roleId')
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
					...filter(user, key => key !== 'password' && key !== 'majors'),
					roles,
					roleIds
				}
			})
		}
	}

	async findOne(id: number) {
		return await this.userRepository.findOneBy({ id })
	}

	update(id: number, updateUserDto: UpdateUserDto) {
		return this.userRepository.update(id, updateUserDto)
	}

	async remove(id: number) {
		const userRoleIds = await this.userRoleRepository.find({
			where: { userId: id },
			select: ['id']
		})
		if (userRoleIds.length > 0) {
			await this.userRoleRepository
				.createQueryBuilder()
				.delete()
				.whereInIds(userRoleIds.map(u => u.id))
				.execute()
		}
		return this.userRepository.softDelete({ id })
	}

	async setUserRoles({ uid, roles }: UserRolesDto) {
		if (roles.length === 0) {
			throw new BadParamsException('40010')
		} else {
			const uidCount = await this.userRepository.countBy({ id: uid })
			if (uidCount === 0) {
				throw new BadParamsException('40006')
			}
			const ridsCount = await this.roleRepository
				.createQueryBuilder('role')
				.where('role.id IN (:...roleIds)', { roleIds: roles })
				.getCount()
			if (ridsCount !== roles.length) {
				throw new BadParamsException('40001')
			}
			const userRoles = await this.userRoleRepository.findBy({ userId: uid })

			const majorRole = userRoles.filter(ur => ur.isMajor)
			if (majorRole.length > 0 && !roles.includes(majorRole[0].roleId)) {
				throw new BadParamsException('40017')
			}

			const deleteRoles = userRoles.filter(role => roles.indexOf(role.roleId) === -1).map(r => r.id)

			const insertRoles = roles
				.filter(rid => userRoles.findIndex(role => role.roleId === rid) === -1)
				.map(rid => new UserRole({ roleId: rid, userId: uid }))

			if (insertRoles.length > 0) {
				await this.userRoleRepository.createQueryBuilder().insert().values(insertRoles).execute()
			}
			if (deleteRoles.length > 0) {
				await this.userRoleRepository.createQueryBuilder().delete().whereInIds(deleteRoles).execute()
			}
		}
	}

	async setMajorRole({ uid, rid }: UserRoleDto) {
		const uidCount = await this.userRepository.countBy({ id: uid })
		if (uidCount === 0) {
			throw new BadParamsException('40006')
		}
		const ridCount = await this.roleRepository.countBy({ id: rid })
		if (ridCount === 0) {
			throw new BadParamsException('40001')
		}
		const curUserRoles = await this.userRoleRepository.findBy({ userId: uid })
		if (curUserRoles.length === 0) {
			throw new BadParamsException('40004')
		}
		const majorRole = curUserRoles.filter(r => r.isMajor)
		if (majorRole.length > 0) {
			if (majorRole[0].roleId === rid) {
				throw new BadParamsException('40003')
			}
			await this.userRoleRepository.update(majorRole[0].id, { isMajor: false })
		}
		return this.userRoleRepository.update({ roleId: rid, userId: uid }, { isMajor: true })
	}
}
