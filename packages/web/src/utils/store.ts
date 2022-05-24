export const setItem = (key: string, value: object | unknown[] | string) => {
	if (isArray(value) || isObject(value)) {
		value = JSON.stringify(value)
	}
	window.localStorage.setItem(key, value as string)
}

export const getItem = (key: string) => {
	const data = window.localStorage.getItem(key)
	try {
		return data === null ? null : JSON.parse(data)
	} catch (error) {
		return data
	}
}

export const removeItem = (key: string) => {
	window.localStorage.removeItem(key)
}

export const removeAllItem = () => {
	window.localStorage.clear()
}

const isArray = <T>(source: T) => {
	return Object.prototype.toString.apply(source) === '[object Array]'
}

const isObject = <T>(source: T) => {
	return Object.prototype.toString.apply(source) === '[object Object]'
}
