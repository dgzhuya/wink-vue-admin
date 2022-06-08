import { Column, Entity } from 'typeorm'
import { BaseEntity } from '@/common/entities/base.entity'

@Entity()
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
}
