import { getConfigPath } from '@/config'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import shell from 'shelljs'

const getWebPath = (filePath: string, prefixPath = '') => resolve(getConfigPath().outVueDir, prefixPath, filePath)

export const isWebExit = (filePath: string, prefixPath = '') => existsSync(getWebPath(filePath, prefixPath))

export const writeWebFile = (fileName: string, source: string, prefixPath = '') => {
	const fileFullPath = getWebPath(fileName, prefixPath)
	if (isWebExit(fileFullPath)) {
		shell.rm(fileFullPath)
	}
	writeFileSync(fileFullPath, source, 'utf8')
}

export const createWebDir = (dirPath: string) => {
	if (!isWebExit(dirPath)) {
		mkdirSync(resolve(getConfigPath().outVueDir, dirPath))
	}
}

export const removeWebDir = (dirPath: string) => {
	if (isWebExit(dirPath)) {
		shell.rm('-rf', resolve(getConfigPath().outVueDir, dirPath))
	}
}
