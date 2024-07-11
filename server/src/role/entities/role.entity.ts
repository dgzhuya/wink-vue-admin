import { BaseEntity } from '@api/common/entities/base.entity'
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import { UserEntity } from '@api/user/entities/user.entity'
import { PermissionEntity } from '@api/permission/entities/permission.entity'

@Entity('w_role')
export class RoleEntity extends BaseEntity {
	@Column({ comment: '标题', length: 30 })
	title: string

	@Column({ comment: '角色描述', length: 200, nullable: true })
	description: string

	@ManyToMany(() => UserEntity, user => user.roles)
	users: UserEntity[]

	@JoinTable({
		name: 'w_role_permission',
		joinColumn: {
			name: 'rid',
			referencedColumnName: 'id'
		},
		inverseJoinColumn: {
			name: 'pid',
			referencedColumnName: 'id'
		}
	})
	@ManyToMany(() => PermissionEntity, permission => permission.roles)
	permissions: PermissionEntity[]
}
