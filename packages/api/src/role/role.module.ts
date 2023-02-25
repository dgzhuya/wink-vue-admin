import { Module } from '@nestjs/common'
import { RoleService } from './role.service'
import { RoleController } from './role.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Role } from './entities/role.entity'
import { RolePermission } from '@/common/entities/role-permission.entity'
import { UserRole } from '@/common/entities/user-role.entity'
import { PermissionModule } from '@/permission/permission.module'

@Module({
	imports: [TypeOrmModule.forFeature([Role, RolePermission, UserRole]), PermissionModule],
	controllers: [RoleController],
	providers: [RoleService],
	exports: [RoleService]
})
export class RoleModule {}
