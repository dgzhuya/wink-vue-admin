import { resolve } from 'path'

const PathConfig = {
	mainFile: '',
	outDir: ''
}

export const getConfigPath = () => PathConfig

export const setConfigPath = (config: Partial<typeof PathConfig>) => {
	if (config.mainFile) PathConfig.mainFile = resolve(process.cwd(), config.mainFile)
	if (config.outDir) PathConfig.outDir = config.outDir
}
