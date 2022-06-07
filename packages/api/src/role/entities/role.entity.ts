import { BaseEntity } from 'src/common/entities/base.entity'
import { Column, Entity } from 'typeorm'

@Entity()
export class Role extends BaseEntity {
	@Column({ comment: '标题', length: 30 })
	title: string

	@Column({ comment: '角色描述', length: 200, nullable: true })
	description: string
}
