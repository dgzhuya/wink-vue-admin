import { Module } from '@nestjs/common'
import { PluginService } from './plugin.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PluginController } from './plugin.controller'
import { Plugin } from './entities/plugin.entity'
import { Permission } from '@/permission/entities/permission.entity'
import { PermissionService } from '@/permission/permission.service'

@Module({
	imports: [TypeOrmModule.forFeature([Plugin, Permission]), PermissionService],
	controllers: [PluginController],
	providers: [PluginService]
})
export class PluginModule {}
