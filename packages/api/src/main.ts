import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { ServerExceptionFilter } from './common/filters/server-execption.filter'
import { TransformInterceptor } from './common/interceptor/transform.interceptor'
import { ValidationPipe } from './common/pipe/validation.pipe'
import { AuthGuard } from '@/common/guard/auth.guard'
import { setConfigPath } from '@wink/compile'
import { join } from 'path'

async function bootstrap() {
	setConfigPath({
		nestDir: join(__dirname, '.'),
		webDir: join(__dirname, '..', 'web')
	})
	const app = await NestFactory.create(AppModule)
	app.useGlobalGuards(new AuthGuard())
	app.useGlobalPipes(new ValidationPipe())
	app.useGlobalInterceptors(new TransformInterceptor())
	app.useGlobalFilters(new ServerExceptionFilter(), new HttpExceptionFilter())
	await app.listen(3000)
}
bootstrap()
