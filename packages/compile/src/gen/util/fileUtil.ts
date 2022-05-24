import { getConfigPath } from '@/config'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import shell from 'shelljs'

const getRealPath = (filePath: string, prefixPath = '') => resolve(getConfigPath().outDir, prefixPath, filePath)

export const isExit = (filePath: string, prefixPath = ''): boolean => existsSync(getRealPath(filePath, prefixPath))

export const write2File = (fileName: string, source: string, prefixPath = '') => {
	const fileFullPath = getRealPath(fileName, prefixPath)
	if (isExit(fileFullPath)) {
		shell.rm(fileFullPath)
	}
	writeFileSync(fileFullPath, source, 'utf8')
}

export const createDir = (dirPath: string) => {
	if (!isExit(dirPath)) {
		mkdirSync(resolve(getConfigPath().outDir, dirPath))
	}
}
