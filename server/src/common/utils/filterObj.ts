type MapFunc<T> = (key: keyof T, value: T[keyof T]) => boolean

/**
 * 筛选对象中的信息
 * @param target 需要筛选的对象
 * @param func 筛选函数，第一个参数为对象的key,第二个参数为对象key对应的值
 */
export const filterObj = <T extends object>(target: T, func?: MapFunc<T>) => {
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
