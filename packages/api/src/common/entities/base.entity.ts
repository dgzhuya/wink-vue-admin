import {
	BeforeSoftRemove,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	PrimaryColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'

@Entity()
export abstract class BaseEntity {
	@PrimaryGeneratedColumn()
	@PrimaryColumn({ comment: '主键ID', type: 'int' })
	id: number

	@CreateDateColumn({ comment: '创建时间', name: 'create_time', default: () => "datetime('now', 'localtime')" })
	createTime: Date

	@UpdateDateColumn({ comment: '修改时间', name: 'update_time', default: () => "datetime('now', 'localtime')" })
	updateTime: Date

	@DeleteDateColumn({ comment: '删除标记', name: 'delete_time', select: false })
	deleteTime: Date

	@BeforeSoftRemove()
	deleteTimeToEastAsia() {
		const currentDate = new Date()
		const eastAsiaOffset = 8 * 60 * 60 * 1000
		this.deleteTime = new Date(currentDate.getTime() + eastAsiaOffset)
	}
}
