import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { DbModule } from './common/db/db.module'
import { UserController } from './user/user.controller'
import { LoggerMiddleware } from './common/middleware/logger.middleware'
import { RoleModule } from './role/role.module'
import { PermissionModule } from './permission/permission.module'
import { PermissionController } from '@/permission/permission.controller'
import { RoleController } from '@/role/role.controller'
import { SysModule } from './sys/sys.module'

@Module({
	imports: [UserModule, DbModule, RoleModule, PermissionModule, SysModule]
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes(UserController, PermissionController, RoleController, SysModule)
	}
}
