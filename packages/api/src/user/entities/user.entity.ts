import { BaseEntity } from 'src/common/entities/base.entity'
import { BeforeInsert, Column, Entity, ManyToMany, JoinTable } from 'typeorm'
import { hash } from 'bcryptjs'
import { Exclude } from 'class-transformer'
import { RoleEntity } from '@/role/entities/role.entity'

@Entity()
export class UserEntity extends BaseEntity {
	@Column({ length: 30, comment: '用户名' })
	username: string

	@Column({ comment: '昵称', length: 30, nullable: true })
	nickname: string

	@Column({ comment: '手机号', nullable: true })
	mobile: string

	@Column({ comment: '性别', type: 'tinyint', nullable: true })
	gender: number

	@Column({ comment: '主要角色', type: 'tinyint', nullable: true })
	major: number

	@Column({ comment: '地址', length: 30, nullable: true })
	address: string

	@Column({ comment: '用户头像', length: '100', nullable: true })
	avatar: string

	@Exclude()
	@Column({ length: 100, comment: '用户密码' })
	password: string

	@JoinTable()
	@ManyToMany(() => RoleEntity)
	roles: Promise<RoleEntity[]>

	@BeforeInsert()
	async encryptPwd() {
		this.password = await hash(this.password, 10)
	}
}
