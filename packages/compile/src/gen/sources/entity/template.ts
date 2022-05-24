export const EntitySource = `import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class %upperModuleName% {
%columnList%
}
`
