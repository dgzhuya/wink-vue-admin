import { Module } from '@nestjs/common'
import { RoleService } from './role.service'
import { RoleController } from './role.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoleEntity } from './entities/role.entity'
import { PermissionModule } from '@api/permission/permission.module'

@Module({
	imports: [TypeOrmModule.forFeature([RoleEntity]), PermissionModule],
	controllers: [RoleController],
	providers: [RoleService],
	exports: [RoleService]
})
export class RoleModule {}
