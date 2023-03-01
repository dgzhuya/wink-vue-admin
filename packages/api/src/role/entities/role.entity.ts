import { BaseEntity } from 'src/common/entities/base.entity'
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import { UserEntity } from '@/user/entities/user.entity'
import { PermissionEntity } from '@/permission/entities/permission.entity'

@Entity()
export class RoleEntity extends BaseEntity {
	@Column({ comment: '标题', length: 30 })
	title: string

	@Column({ comment: '角色描述', length: 200, nullable: true })
	description: string

	@JoinTable()
	@ManyToMany(() => UserEntity)
	users: Promise<UserEntity[]>

	@JoinTable()
	@ManyToMany(() => PermissionEntity)
	permissions: Promise<PermissionEntity[]>
}
