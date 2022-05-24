import { Module } from '@nestjs/common'
import { SysService } from './sys.service'
import { SysController } from './sys.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '@/user/entities/user.entity'
import { Role } from '@/role/entities/role.entity'
import { Permission } from '@/permission/entities/permission.entity'
import { UserRole } from '@/common/entities/user-role.entity'
import { RolePermission } from '@/common/entities/role-permission.entity'

@Module({
	imports: [TypeOrmModule.forFeature([User, Role, Permission, RolePermission, UserRole])],
	controllers: [SysController],
	providers: [SysService]
})
export class SysModule {}
