import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'sqlite',
			database: 'admin.db',
			autoLoadEntities: true,
			synchronize: true
		})
	]
})
export class DbModule {}
