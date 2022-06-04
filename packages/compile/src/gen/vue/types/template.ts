export const tableTypeStr = (upperModuleName: string, typeStr: string) => `export interface ${upperModuleName}Model {
${typeStr}
}\n`

export const formTypeStr = (upperModuleName: string, typeStr: string) => `export interface ${upperModuleName}Dto {
${typeStr}
}\n`
