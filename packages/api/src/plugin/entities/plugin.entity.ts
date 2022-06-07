import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from 'src/common/entities/base.entity'

@Entity()
export class Plugin extends BaseEntity {
	@PrimaryGeneratedColumn()
	@Column({ primary: true })
	id: number

	@Column()
	url: string

	@Column()
	title: string

	@Column({ nullable: true })
	description: string
}
