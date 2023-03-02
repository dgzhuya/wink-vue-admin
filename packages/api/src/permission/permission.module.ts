import { Module } from '@nestjs/common'
import { PermissionService } from './permission.service'
import { PermissionController } from './permission.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PermissionEntity } from '@/permission/entities/permission.entity'

@Module({
	imports: [TypeOrmModule.forFeature([PermissionEntity])],
	controllers: [PermissionController],
	providers: [PermissionService],
	exports: [PermissionService]
})
export class PermissionModule {}
