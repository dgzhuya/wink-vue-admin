import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { getDatabase } from '../utils/read-config'

const { type, host, password, port, username, database } = getDatabase('mysql')

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type,
			host,
			port,
			username,
			password,
			database,
			autoLoadEntities: true,
			synchronize: true
		})
	]
})
export class MysqlModule {}
