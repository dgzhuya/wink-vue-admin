export const ModuleSource = `import { Module } from '@nestjs/common'
import { %upperModuleName%Service } from './%moduleName%.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { %upperModuleName%Controller } from './%moduleName%.controller'
import { %upperModuleName% } from './entities/%moduleName%.entity'


@Module({
	imports: [TypeOrmModule.forFeature([%upperModuleName%])],
	controllers: [%upperModuleName%Controller],
	providers: [%upperModuleName%Service]
})
export class %upperModuleName%Module {}
`
