import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { getDatabase } from '../utils/read-config'

const { path } = getDatabase('sqlite')

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'better-sqlite3',
			database: path,
			autoLoadEntities: true,
			synchronize: true
		})
	]
})
export class SQLiteModule {}
