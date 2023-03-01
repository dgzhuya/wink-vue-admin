import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './entities/user.entity'
import { UserRole } from '@/common/entities/user-role.entity'
import { RoleModule } from '@/role/role.module'

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, UserRole]), RoleModule],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService]
})
export class UserModule {}
