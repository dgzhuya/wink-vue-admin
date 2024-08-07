import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany } from 'typeorm'
import { BaseEntity } from '@api/common/entities/base.entity'
import { RoleEntity } from '@api/role/entities/role.entity'

@Entity('w_permission')
export class PermissionEntity extends BaseEntity {
	@Column({ comment: '权限名称', length: 100 })
	title: string

	@Column({ comment: '权限标记', length: 100, nullable: true })
	key: string

	@Column({ comment: '角色描述', length: 200, nullable: true })
	description: string

	@ManyToOne(() => PermissionEntity, p => p.children)
	@JoinColumn({ name: 'pid' })
	parent: PermissionEntity

	@OneToMany(() => PermissionEntity, p => p.parent)
	children: PermissionEntity[]

	@ManyToMany(() => RoleEntity, role => role.permissions)
	roles: RoleEntity[]
}
