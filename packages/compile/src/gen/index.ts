import { ASTNode } from '@/parser/ast/ASTNode'
import { upperCase } from '@/gen/util/upperCase'
import { genNestModule } from '@/gen/sources'
import { genVueCode } from '@/gen/vue'
import { getModuleName } from '@/gen/util/getInfoByAST'

export const translate = (astNode: ASTNode) => {
	const moduleName = getModuleName(astNode)
	const upperModuleName = upperCase(moduleName)

	genNestModule(moduleName, upperModuleName, astNode)
	genVueCode(moduleName, upperModuleName, astNode)
}
