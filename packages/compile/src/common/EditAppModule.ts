import { ObjectLiteralExpression, Project, PropertyAssignment } from 'ts-morph'
import { getConfigPath } from '@/config'
import { HandleStatus } from '@/common/Status'

export const editAppModule = (
	moduleName: string,
	upperModuleName: string,
	handleType: HandleStatus = HandleStatus.ADD
) => {
	const path = getConfigPath().appModulePath
	const project = new Project()
	project.addSourceFileAtPath(path)
	const sourceFile = project.getSourceFileOrThrow(path)

	const appModuleClass = sourceFile.getClassOrThrow('AppModule')

	const callExpression = appModuleClass.getDecoratorOrThrow('Module').getCallExpressionOrThrow()
	const propertyAssignment = (callExpression.getArguments()[0] as ObjectLiteralExpression).getProperty(
		'imports'
	) as PropertyAssignment
	const initializer = propertyAssignment.getStructure().initializer.toString()

	const configureMethod = appModuleClass.getMethodOrThrow('configure')
	const bodyText = configureMethod.getBodyText()

	if (handleType === HandleStatus.ADD) {
		sourceFile.addImportDeclarations([
			{
				namedImports: [`${upperModuleName}Module`],
				moduleSpecifier: `./${moduleName}/${moduleName}.module`
			},
			{
				namedImports: [`${upperModuleName}Controller`],
				moduleSpecifier: `./${moduleName}/${moduleName}.controller`
			}
		])
		propertyAssignment.setInitializer(`${initializer.slice(0, initializer.length - 1)}, ${upperModuleName}Module]`)

		if (bodyText) {
			configureMethod.setBodyText(`${bodyText.slice(0, bodyText.length - 1)}, ${upperModuleName}Controller)`)
		}
	} else {
		const moduleImport = sourceFile.getImportDeclarationOrThrow(`./${moduleName}/${moduleName}.module`)
		moduleImport.remove()
		const controller = sourceFile.getImportDeclarationOrThrow(`./${moduleName}/${moduleName}.controller`)
		controller.remove()
		propertyAssignment.setInitializer(initializer.replace(new RegExp(`,*\\n*\\s*${upperModuleName}Module`), ''))
		if (bodyText) {
			configureMethod.setBodyText(bodyText.replace(new RegExp(`,*\\n*\\s*${upperModuleName}`), ''))
		}
	}

	sourceFile.saveSync()
}
