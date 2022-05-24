interface MapFunc<T> {
	(key: keyof T, value: T[keyof T]): boolean
}

export const filter = <T extends object>(target: T, func?: MapFunc<T>) => {
	const result: Partial<T> = {}
	for (const key in target) {
		if (func) {
			if (func(key, target[key])) {
				result[key as keyof T] = target[key]
			}
		} else {
			result[key as keyof T] = target[key]
		}
	}
	return result
}
