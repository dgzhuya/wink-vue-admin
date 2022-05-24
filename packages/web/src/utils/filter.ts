export const filterHandler = <T extends object>(source: T, callback: (key: keyof T, val?: T[keyof T]) => boolean) => {
	const result: Partial<T> = {}
	for (const key in source) {
		if (callback(key, source[key])) {
			result[key] = source[key]
		}
	}
	return result
}

export const isNotNull = (val: any) => val !== '' && val !== null && val !== undefined

export const filterNullHandler = <T extends object>(source: T) => {
	const result: Partial<T> = {}
	for (const key in source) {
		if (isNotNull(source[key])) {
			result[key] = source[key]
		}
	}
	return result
}
