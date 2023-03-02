import { Module } from '@nestjs/common'
import { PluginService } from './plugin.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PluginController } from './plugin.controller'
import { PluginEntity } from './entities/plugin.entity'
import { PermissionModule } from '@/permission/permission.module'

@Module({
	imports: [TypeOrmModule.forFeature([PluginEntity]), PermissionModule],
	controllers: [PluginController],
	providers: [PluginService]
})
export class PluginModule {}
