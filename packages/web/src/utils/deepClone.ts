export const deepClone = <T extends object>(source: T): T => {
	const sourceClone = Array.isArray(source) ? ([] as T) : ({} as T)
	if (source && typeof source === 'object') {
		for (const k in source) {
			const key = k as keyof T
			const val = source[key] as T[keyof T]
			if (source.hasOwnProperty(key)) {
				if (val && typeof val === 'object') {
					sourceClone[key] = deepClone(val)
				} else {
					sourceClone[key] = source[key]
				}
			}
		}
	}
	return sourceClone
}
