import { Module } from '@nestjs/common'
import { PermissionService } from './permission.service'
import { PermissionController } from './permission.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RolePermission } from '@/common/entities/role-permission.entity'
import { PermissionEntity } from '@/permission/entities/permission.entity'

@Module({
	imports: [TypeOrmModule.forFeature([RolePermission, PermissionEntity])],
	controllers: [PermissionController],
	providers: [PermissionService],
	exports: [PermissionService]
})
export class PermissionModule {}
