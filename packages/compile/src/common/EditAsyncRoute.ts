import { getConfigPath } from '@/config'
import { resolve } from 'path'
import { Project, SyntaxKind } from 'ts-morph'
import { HandleStatus } from '@/common/Status'

export const editAsyncRoute = (importPath: string, importName: string, handleType: HandleStatus = HandleStatus.ADD) => {
	const path = resolve(getConfigPath().outVueDir, 'router/module/index.ts')
	const project = new Project()

	project.addSourceFileAtPath(path)
	const sourceFile = project.getSourceFileOrThrow(path)

	const asyncRoutes = sourceFile.getVariableDeclarationOrThrow('asyncRoutes')

	const arrayLiteralExpression = asyncRoutes.getFirstChildByKindOrThrow(SyntaxKind.ArrayLiteralExpression)

	if (handleType === HandleStatus.ADD) {
		sourceFile.addImportDeclarations([
			{
				namedImports: [`${importName}`],
				moduleSpecifier: `./${importPath}`
			}
		])
		arrayLiteralExpression.addElement(`${importName}`)
	} else {
		const moduleImport = sourceFile.getImportDeclarationOrThrow(`./${importPath}`)
		moduleImport.remove()
		const element = arrayLiteralExpression.getElements()
		for (let i = 0; i < element.length; i++) {
			const item = element[i]
			const str = item.getText()
			if (str === importPath) {
				arrayLiteralExpression.removeElement(i)
			}
		}
	}
	sourceFile.saveSync()
}
