import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { UserController } from './user/user.controller'
import { LoggerMiddleware } from './common/middleware/logger.middleware'
import { RoleModule } from './role/role.module'
import { PermissionModule } from './permission/permission.module'
import { PermissionController } from '@api/permission/permission.controller'
import { RoleController } from '@api/role/role.controller'
import { SysModule } from './sys/sys.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { DBModule } from './common/db/db.module'

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'static')
		}),
		DBModule,
		UserModule,
		RoleModule,
		PermissionModule,
		SysModule
	]
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes(UserController, PermissionController, RoleController, SysModule)
	}
}
