import { getConfigPath } from '@/config'
import { resolve } from 'path'
import { Project, SyntaxKind } from 'ts-morph'

export const editAsyncRoute = (filePath: string, prefixModuleName: string, handleType: 'add' | 'remove' = 'add') => {
	const path = resolve(getConfigPath().outVueDir, 'router/module/index.ts')
	const project = new Project()

	project.addSourceFileAtPath(path)
	const sourceFile = project.getSourceFileOrThrow(path)
	if (handleType === 'add') {
		sourceFile.addImportDeclarations([
			{
				namedImports: [`${prefixModuleName}`],
				moduleSpecifier: `./${filePath}`
			}
		])
	} else {
		const moduleImport = sourceFile.getImportDeclarationOrThrow(`./${filePath}`)
		moduleImport.remove()
	}

	const asyncRoutes = sourceFile.getVariableDeclarationOrThrow('asyncRoutes')

	const arrayLiteralExpression = asyncRoutes.getFirstChildByKindOrThrow(SyntaxKind.ArrayLiteralExpression)
	if (handleType === 'add') {
		arrayLiteralExpression.addElement(`${prefixModuleName}`)
	} else {
		const element = arrayLiteralExpression.getElements()
		for (let i = 0; i < element.length; i++) {
			const item = element[i]
			const str = item.getText()
			if (str === prefixModuleName) {
				arrayLiteralExpression.removeElement(i)
			}
		}
	}
	sourceFile.saveSync()
}
