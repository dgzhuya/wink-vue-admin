export const ModuleSource = `import { Module } from '@nestjs/common'
import { %upperModuleName%Service } from './%moduleName%.service'
import { %upperModuleName%Controller } from './%moduleName%.controller'

@Module({
\tcontrollers: [%upperModuleName%Controller],
\tproviders: [%upperModuleName%Service]
})
export class %upperModuleName%Module {}
`
