import { ObjectLiteralExpression, Project, PropertyAssignment } from 'ts-morph'
import { resolve } from 'path'

const path = resolve(__dirname, '../example/main.ts')
const project = new Project()
project.addSourceFileAtPath(path)
const sourceFile = project.getSourceFileOrThrow(path)

const appModuleClass = sourceFile.getClass('AppModule')
sourceFile.addImportDeclarations([
	{
		namedImports: ['HelloModule'],
		moduleSpecifier: './hello.module'
	},
	{
		namedImports: ['HelloController'],
		moduleSpecifier: './hello.controller'
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
							`${initializer.slice(0, initializer.length - 1)}, HelloModule]`
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
			configureMethod.setBodyText(`${bodyText.slice(0, bodyText.length - 1)}, HelloController)`)
		}
	}
}

sourceFile.saveSync()
