import { ElMessage, ElMessageBox } from 'element-plus'

export const deleteEffect = <T>(
	deleteFunc: (id: number) => Promise<void>,
	fetchFunc: () => Promise<void>,
	message = ''
) => {
	const deleteHandler = (id: number) => {
		ElMessageBox.confirm(`是否确认删除${message}?`, '删除提醒', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning',
			draggable: true,
			buttonSize: 'small'
		})
			.then(async () => {
				await deleteFunc(id)
				ElMessage({
					type: 'success',
					message: '删除成功'
				})
				await fetchFunc()
			})
			.catch(() => {
				ElMessage({
					type: 'info',
					message: '取消删除'
				})
			})
	}

	return { deleteHandler }
}
