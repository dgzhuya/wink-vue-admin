export const modelSource = (upperModuleName: string, typeStr: string) => `export interface ${upperModuleName}Model {
${typeStr}
}\n`

export const dtoSource = (upperModuleName: string, typeStr: string) => `export interface ${upperModuleName}Dto {
${typeStr}
}\n`
