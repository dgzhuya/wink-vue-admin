export const deepClone = <T extends object>(source: T) => {
	const sourceClone: any = Array.isArray(source) ? [] : {}
	if (source && typeof source === 'object') {
		for (const key in source) {
			if (source.hasOwnProperty(key)) {
				if (source[key] && typeof source[key] === 'object') {
					sourceClone[key] = deepClone(source[key] as unknown as object)
				} else {
					sourceClone[key] = source[key]
				}
			}
		}
	}
	return sourceClone
}
