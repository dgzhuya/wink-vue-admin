import { TableParams, TableResult } from '@/types'

export const pageEffect = <T>(fetchFunc: (config: TableParams) => Promise<TableResult<T>>) => {
	const total = ref(0)
	const page = ref(1)
	const count = ref(5)
	const tableData = ref<T>()

	const fetchHandler = async () => {
		const result = await fetchFunc({
			page: page.value,
			count: count.value
		})
		total.value = result.total
		tableData.value = result.list
	}

	const pageHandler = (currentPage: number) => {
		page.value = currentPage
		fetchHandler()
	}

	const sizeHandler = (currentSize: number) => {
		count.value = currentSize
		fetchHandler()
	}

	return {
		tableData,
		size: readonly(count),
		total: readonly(total),
		page: readonly(page),
		fetchHandler,
		pageHandler,
		sizeHandler
	}
}
