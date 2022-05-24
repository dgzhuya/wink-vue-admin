import { Module } from '@nestjs/common'
import { PermissionService } from './permission.service'
import { PermissionController } from './permission.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Permission } from './entities/permission.entity'
import { RolePermission } from '@/common/entities/role-permission.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Permission, RolePermission])],
	controllers: [PermissionController],
	providers: [PermissionService]
})
export class PermissionModule {}
