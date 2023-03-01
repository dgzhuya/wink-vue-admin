import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm'
import { BaseEntity } from '@/common/entities/base.entity'
import { RoleEntity } from '@/role/entities/role.entity'

@Entity()
export class PermissionEntity extends BaseEntity {
	@Column({ comment: '权限名称', length: 100 })
	title: string

	@Column({ comment: '权限标记', length: 100, nullable: true })
	key: string

	@Column({ comment: '角色描述', length: 200, nullable: true })
	description: string

	@ManyToOne(() => PermissionEntity, p => p.children)
	parent: Promise<PermissionEntity>

	@OneToMany(() => PermissionEntity, p => p.parent)
	children: Promise<PermissionEntity[]>

	@JoinTable()
	@ManyToMany(() => RoleEntity)
	roles: Promise<RoleEntity[]>
}
