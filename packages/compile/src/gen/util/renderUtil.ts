type RenderConfig<T extends string> = T extends `${string}%${infer U}%${infer reset}`
	? RenderConfig<reset> extends never
		? {
				[key in U]: number | string
		  }
		: {
				[key in keyof RenderConfig<reset> | U]: number | string
		  }
	: never

export const renderStrByTemplate = <T extends string>(source: T, config: RenderConfig<T>) => {
	const len = source.length
	let i = 0
	let isKey = false
	let result = ''
	let key = ''
	while (i < len) {
		const char = source[i]
		if (char === '\n' || char === '\t' || char === '\r') {
			result += char
		} else if (char === '%') {
			if (isKey) {
				result += config[key]
				key = ''
			}
			isKey = !isKey
		} else if (isKey) {
			key += char
		} else {
			result += char
		}
		i++
	}
	return result
}
