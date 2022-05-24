import { Ref } from 'vue'

export const showFormEffect = <T, K>(activeItem: Ref<T | null>, fetchFunc: () => Promise<void>, extraItem?: Ref<K>) => {
	const showModel = ref(false)

	const showHandler = (item?: T) => {
		if (!item) {
			activeItem.value = null
		} else {
			activeItem.value = item
		}
		showModel.value = true
	}

	const showExtraHandler = (extra: K, item?: T) => {
		if (extraItem) {
			extraItem.value = extra
		}
		showHandler(item)
	}

	const closeHandler = (refresh: boolean) => {
		showModel.value = false
		if (refresh) {
			console.log('refresh:', refresh)
			fetchFunc()
		}
	}
	return {
		showModel,
		showHandler,
		showExtraHandler,
		closeHandler
	}
}
