import { ASTNode } from '@/parser/ast/ASTNode'
import { genController } from '@/gen/sources/controller'
import { genDTO } from '@/gen/sources/dto'
import { genEntity } from '@/gen/sources/entity'
import { genModule } from '@/gen/sources/module'
import { genService } from '@/gen/sources/service'
import { editAppModule } from '@/common/EditAppModule'

export const genNestModule = (moduleName: string, upperModuleName: string, astNode: ASTNode) => {
	genController(moduleName, upperModuleName, astNode)
	genDTO(moduleName, upperModuleName, astNode)
	genEntity(moduleName, upperModuleName, astNode)
	genModule(moduleName, upperModuleName)
	genService(moduleName, upperModuleName, astNode)
	editAppModule(moduleName, upperModuleName)
}
