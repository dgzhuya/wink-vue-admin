import { ElMessage, ElMessageBox } from 'element-plus'

export const deleteEffect = (
	deleteFunc: (id: number) => Promise<void>,
	fetchFunc: () => Promise<void>,
	message = ''
) => {
	const deleteHandler = async (id: number, refresh = true) => {
		try {
			await ElMessageBox.confirm(`是否确认删除${message}?`, '删除提醒', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
				draggable: true,
				buttonSize: 'small'
			})
			await deleteFunc(id)
			if (refresh) await fetchFunc()
			return 'ok'
		} catch (error) {
			if (error === 'cancel') {
				ElMessage({
					type: 'info',
					message: '取消删除'
				})
			}
		}
	}

	return { deleteHandler }
}
