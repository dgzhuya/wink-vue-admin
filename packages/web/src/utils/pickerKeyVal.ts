export const pickerKeyVal = <T extends object>(source: T, ...keys: (keyof T)[]) => {
	const result: Partial<T> = {}
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i]
		result[key] = source[key]
	}
	return result
}
