import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

interface UserRoleInit {
	roleId: number
	userId: number
	isMajor?: boolean
}

@Entity()
export class UserRole {
	constructor(userRole?: UserRoleInit) {
		if (userRole) {
			this.roleId = userRole.roleId
			this.userId = userRole.userId
			this.isMajor = userRole.isMajor || false
		}
	}

	@PrimaryGeneratedColumn()
	@Column({ comment: 'ID', primary: true })
	id: number

	@Column({ comment: '角色ID' })
	roleId: number

	@Column({ comment: '用户ID' })
	userId: number

	@Column({ comment: '默认角色', type: 'tinyint', default: false })
	isMajor: boolean
}
