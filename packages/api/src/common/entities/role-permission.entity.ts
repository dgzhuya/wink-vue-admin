import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class RolePermission {
	constructor(roleId: number, permissionId: number) {
		this.roleId = roleId
		this.permissionId = permissionId
	}

	@PrimaryGeneratedColumn()
	@Column({ comment: 'ID', primary: true })
	id: number

	@Column({ comment: '角色ID' })
	roleId: number

	@Column({ comment: '标题权限ID' })
	permissionId: number
}
