import { Column, Entity, Tree, TreeChildren, TreeParent } from 'typeorm'
import { BaseEntity } from '@/common/entities/base.entity'
import { UpdatePermissionDto } from '@/permission/dto/update-permission.dto'

@Entity()
@Tree('materialized-path')
export class Permission extends BaseEntity {
	@Column({ comment: '权限名称', length: 100 })
	title: string

	@Column({ comment: '权限标记', length: 100, nullable: true })
	key: string

	@Column({ comment: '角色描述', length: 200, nullable: true })
	description: string

	@Column({ comment: '父id', nullable: true })
	parentId: number

	@Column({ comment: '是否拥有子元素', default: false })
	hasChildren: boolean

	@TreeParent()
	parent: Permission

	@TreeChildren()
	children: Permission[]
}
