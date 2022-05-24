import { Module } from '@nestjs/common'
import { RoleService } from './role.service'
import { RoleController } from './role.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Role } from './entities/role.entity'
import { Permission } from '@/permission/entities/permission.entity'
import { RolePermission } from '@/common/entities/role-permission.entity'
import { UserRole } from '@/common/entities/user-role.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Role, Permission, RolePermission, UserRole])],
	controllers: [RoleController],
	providers: [RoleService]
})
export class RoleModule {}
