import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export abstract class BaseEntity {
	@PrimaryGeneratedColumn()
	@Column({ comment: 'ID', primary: true })
	id: number

	@CreateDateColumn({ comment: '创建时间', name: 'create_time' })
	createTime: Date

	@UpdateDateColumn({ comment: '修改时间', name: 'update_time' })
	updateTime: Date

	@DeleteDateColumn({ comment: '删除标记', name: 'delete_time', select: false })
	deleteTime: Date
}
