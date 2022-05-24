export const controllerSource = `import { Controller%reqMethods% } from '@nestjs/common'
import { %upperModuleName%Service } from './%moduleName%.service'
import { Create%upperModuleName%Dto } from './dto/create-%moduleName%.dto'
import { Update%upperModuleName%Dto } from './dto/update-%moduleName%.dto'

@Controller('%moduleName%')
export class %upperModuleName%Controller {
	constructor(private readonly %moduleName%Service: %upperModuleName%Service) {}
%create%%getAll%%getOne%%update%%delete%
}
`

export const controllerCreateSource = (moduleName: string, upperModuleName: string) => `
	@Post()
	create(@Body() create${upperModuleName}Dto: Create${upperModuleName}Dto) {
		return this.${moduleName}Service.create(create${upperModuleName}Dto)
	}
`

export const controllerAllSource = (moduleName: string) => `
	@Get()
	findAll() {
		return this.${moduleName}Service.findAll()
	}
`

export const controllerGetSource = (moduleName: string) => `
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.${moduleName}Service.findOne(+id)
	}
`

export const controllerUpdateSource = (moduleName: string, upperModuleName: string) => `
	@Patch(':id')
	update(@Param('id') id: string, @Body() update${upperModuleName}Dto: Update${upperModuleName}Dto) {
		return this.${moduleName}Service.update(+id, update${upperModuleName}Dto)
	}
`

export const controllerDeleteSource = (moduleName: string) => `
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.${moduleName}Service.remove(+id)
	}
`
