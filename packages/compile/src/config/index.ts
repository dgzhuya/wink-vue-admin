const PathConfig = {
	nestDir: '',
	webDir: ''
}

export const getConfigPath = () => PathConfig

export const setConfigPath = (config: Partial<typeof PathConfig>) => {
	if (config.nestDir) PathConfig.nestDir = config.nestDir
	if (config.webDir) PathConfig.webDir = config.webDir
}
