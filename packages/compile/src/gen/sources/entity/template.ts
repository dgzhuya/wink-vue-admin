export const EntitySource = `import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
%baseEntityImport%
@Entity()
export class %upperModuleName% %extendsBaseEntity%{
%columnList%
}
`
