export const CreateDtoSource = `export class Create%upperModuleName%Dto {
%dtoList%
}
`

export const UpdateDtoSource = `import { PartialType } from '@nestjs/mapped-types'
import { Create%upperModuleName%Dto } from './create-%moduleName%.dto'

export class Update%upperModuleName%Dto extends PartialType(Create%upperModuleName%Dto) {}`
