import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from 'src/common/entities/base.entity'

@Entity()
export class Plugin extends BaseEntity {
	@PrimaryGeneratedColumn()
	@Column({ primary: true })
	id: number

	@Column({ comment: '插件文件地址' })
	url: string

	@Column({ comment: '插件名' })
	name: string

	@Column({ comment: '插件唯一标识' })
	key: string

	@Column({ comment: '路由地址' })
	routePath: string

	@Column({ comment: '插件路由名称' })
	routeName: string

	@Column({ nullable: true, comment: '插件描述' })
	description: string
}
