import { Module } from '@nestjs/common'
import { SysService } from './sys.service'
import { SysController } from './sys.controller'
import { UserModule } from '@/user/user.module'
import { RoleModule } from '@/role/role.module'

@Module({
	imports: [UserModule, RoleModule],
	controllers: [SysController],
	providers: [SysService]
})
export class SysModule {}
