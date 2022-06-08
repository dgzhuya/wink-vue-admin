export const serviceSource = `import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Create%upperModuleName%Dto } from './dto/create-%moduleName%.dto'
import { Update%upperModuleName%Dto } from './dto/update-%moduleName%.dto'
import { %upperModuleName% } from './entities/%moduleName%.entity'
import { isNotNull } from '@/common/utils/isNotNull'

@Injectable()
export class %upperModuleName%Service {
	constructor(
		@InjectRepository(%upperModuleName%) private readonly %moduleName%Repository: Repository<%upperModuleName%>
	) {}
	%create%%getAll%%getOne%%update%%delete%
}
`

export const serviceCreateSource = (moduleName: string, upperModuleName: string) => `
	create(create${upperModuleName}Dto: Create${upperModuleName}Dto) {
		return this.${moduleName}Repository.save(create${upperModuleName}Dto)
	}
`

export const serviceAllSource = (moduleName: string) => `
	findAll(skip: number, take: number, search?: string) {
		if (isNotNull(skip) && isNotNull(take)) {
			let queryBuilder = this.${moduleName}Repository.createQueryBuilder('${moduleName}')
			if (search) {
				queryBuilder = queryBuilder
					.where('role.title like :search', { search: \`%\${search}%\` })
					.orWhere('role.description like :search', { search: \`%\${search}%\` })
			}
			const [list, total] = await queryBuilder.skip(skip).take(take).getManyAndCount()
			return {
				list,
				total
			}
		}
		return this.${moduleName}Repository.find()
	}
`

export const serviceGetSource = (moduleName: string) => `
	findOne(id: number) {
		return this.${moduleName}Repository.findOneBy({ id })
	}
`

export const serviceUpdateSource = (moduleName: string, upperModuleName: string) => `
	update(id: number, update${upperModuleName}Dto: Update${upperModuleName}Dto) {
		return this.${moduleName}Repository.update(id, update${upperModuleName}Dto)
	}
`

export const serviceDeleteSource = (moduleName: string) => `
	remove(rid: number) {
		return this.${moduleName}Repository.softDelete(rid)
	}
`
