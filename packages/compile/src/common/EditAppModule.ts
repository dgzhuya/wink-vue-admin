import { ObjectLiteralExpression, Project, PropertyAssignment } from 'ts-morph'
import { getConfigPath } from '@/config'

export const editAppModule = (moduleName: string, upperModuleName: string, handleType: 'add' | 'remove' = 'add') => {
	const path = getConfigPath().appModulePath
	const project = new Project()
	project.addSourceFileAtPath(path)
	const sourceFile = project.getSourceFileOrThrow(path)

	if (handleType === 'add') {
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
	} else {
		const moduleImport = sourceFile.getImportDeclarationOrThrow(`./${moduleName}/${moduleName}.module`)
		moduleImport.remove()
		const controller = sourceFile.getImportDeclarationOrThrow(`./${moduleName}/${moduleName}.controller`)
		controller.remove()
	}

	const appModuleClass = sourceFile.getClassOrThrow('AppModule')

	const callExpression = appModuleClass.getDecoratorOrThrow('Module').getCallExpressionOrThrow()
	const propertyAssignment = (callExpression.getArguments()[0] as ObjectLiteralExpression).getProperty(
		'imports'
	) as PropertyAssignment
	const initializer = propertyAssignment.getStructure().initializer.toString()

	if (handleType === 'add') {
		propertyAssignment.setInitializer(`${initializer.slice(0, initializer.length - 1)}, ${upperModuleName}Module]`)
	} else {
		propertyAssignment.setInitializer(initializer.replace(`, ${upperModuleName}Module`, ''))
	}

	const configureMethod = appModuleClass.getMethodOrThrow('configure')
	const bodyText = configureMethod.getBodyText()
	if (bodyText) {
		if (handleType === 'add') {
			configureMethod.setBodyText(`${bodyText.slice(0, bodyText.length - 1)}, ${upperModuleName}Controller)`)
		} else {
			configureMethod.setBodyText(bodyText.replace(`, ${upperModuleName}Controller`, ''))
		}
	}

	sourceFile.saveSync()
}
