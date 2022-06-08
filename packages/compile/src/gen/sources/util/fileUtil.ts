import { getConfigPath } from '@/config'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import shell from 'shelljs'

const getNestModulePath = (filePath: string, prefixPath = '') => resolve(getConfigPath().outDir, prefixPath, filePath)

export const isNestExit = (filePath: string, prefixPath = '') => existsSync(getNestModulePath(filePath, prefixPath))

export const writeNestFile = (fileName: string, source: string, prefixPath = '') => {
	const fileFullPath = getNestModulePath(fileName, prefixPath)
	if (isNestExit(fileFullPath)) {
		shell.rm(fileFullPath)
	}
	writeFileSync(fileFullPath, source, 'utf8')
}

export const createNestDir = (dirPath: string) => {
	if (!isNestExit(dirPath)) {
		mkdirSync(resolve(getConfigPath().outDir, dirPath))
	}
}

export const removeNestDir = (dirPath: string) => {
	if (isNestExit(dirPath)) {
		shell.rm('-rf', resolve(getConfigPath().outDir, dirPath))
	}
}
