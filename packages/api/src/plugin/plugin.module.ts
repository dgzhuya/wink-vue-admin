import { Module } from '@nestjs/common'
import { PluginService } from './plugin.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PluginController } from './plugin.controller'
import { Plugin } from './entities/plugin.entity'
import { Permission } from '@/permission/entities/permission.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Plugin, Permission])],
	controllers: [PluginController],
	providers: [PluginService]
})
export class PluginModule {}
