import { ObjectLiteralExpression, Project, PropertyAssignment } from 'ts-morph'
import { getConfigPath } from '@/config'

export const editAppModule = (moduleName: string, upperModuleName: string) => {
	const path = getConfigPath().appModulePath
	const project = new Project()
	project.addSourceFileAtPath(path)
	const sourceFile = project.getSourceFileOrThrow(path)

	const appModuleClass = sourceFile.getClass('AppModule')
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

	if (appModuleClass) {
		const decorator = appModuleClass.getDecorator('Module')
		if (decorator) {
			const callExpression = decorator.getCallExpression()
			if (callExpression) {
				const arg = callExpression.getArguments()[0]
				if (arg) {
					const imports = (arg as ObjectLiteralExpression).getProperty('imports')
					if (imports) {
						const propertyAssignment = imports as PropertyAssignment
						const structure = propertyAssignment.getStructure()
						if (structure) {
							const initializer = structure.initializer.toString()
							propertyAssignment.setInitializer(
								`${initializer.slice(0, initializer.length - 1)}, ${upperModuleName}Module]`
							)
						}
					}
				}
			}
		}
		const configureMethod = appModuleClass.getMethod('configure')
		if (configureMethod) {
			const bodyText = configureMethod.getBodyText()
			if (bodyText) {
				configureMethod.setBodyText(`${bodyText.slice(0, bodyText.length - 1)}, ${upperModuleName}Controller)`)
			}
		}
	}

	sourceFile.saveSync()
}
