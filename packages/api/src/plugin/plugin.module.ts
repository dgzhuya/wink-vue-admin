import { Module } from '@nestjs/common'
import { PluginService } from './plugin.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PluginController } from './plugin.controller'
import { Plugin } from './entities/plugin.entity'
import { Permission } from '@/permission/entities/permission.entity'
import { RolePermission } from '@/common/entities/role-permission.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Plugin, Permission, RolePermission])],
	controllers: [PluginController],
	providers: [PluginService]
})
export class PluginModule {}
