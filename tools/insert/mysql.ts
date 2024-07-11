import { createConnection, PreparedStatementInfo, ResultSetHeader } from 'mysql2/promise'
import { getDatabase } from '../data-config'

async function findIdByKey(key: string, selectStmt: PreparedStatementInfo) {
	const [rows] = await selectStmt.execute([key])
	const result = rows[0] as { id: number | bigint }
	return result ? result.id : undefined
}

export async function insertToMysql(routePath: string, routeTitle: string, isDelete = false) {
	const { host, port, username: user, password, database } = getDatabase('mysql')
	const connection = await createConnection({
		host,
		port,
		user,
		password,
		database
	})
	const selectStmt = await connection.prepare(`SELECT id FROM w_permission WHERE \`key\` = ?`)

	const insertStmt = await connection.prepare(
		`INSERT INTO w_permission (title, \`key\`, description, pid) VALUES (?, ?, ?, ?)`
	)
	const deleteStmt = await connection.prepare(`DELETE FROM w_permission WHERE \`key\` = ?`)

	const [tables] = (await connection.execute("SHOW TABLES LIKE 'w_permission'")) as any[]
	if (tables.length === 0) {
		console.error('权限表不存在')
		return connection.end()
	}

	const pathList = routePath.split('/').filter(p => p)
	const prefixKey = pathList.length > 1 ? '#' + pathList[0].replaceAll('-', '_') : ''
	let pid: null | number | bigint = null
	if (prefixKey) {
		const id = await findIdByKey(prefixKey, selectStmt)
		if (!id) {
			console.error(`父级权限${prefixKey}不存在`)
			await connection.end()
			return
		}
		pid = id
	}
	const key = '#' + pathList.join('_').replaceAll('-', '_')

	try {
		await connection.beginTransaction()
		if (isDelete) {
			const list = ['@add', '@update', '@delete'].map(k => key + k)
			for (const k of list) {
				await deleteStmt.execute([k])
			}
			await deleteStmt.execute([key])
		} else {
			const keyId = await findIdByKey(key, selectStmt)
			if (keyId) {
				console.error(`当前权限${key}已存在`)
				await connection.rollback()
				await connection.end()
				return
			}
			const [result] = (await insertStmt.execute([
				routeTitle,
				key,
				`${routeTitle}页面查看`,
				pid
			])) as ResultSetHeader[]
			const lastInsertId = result.insertId

			const list = [
				{ k: '@add', title: '添加' },
				{ k: '@update', title: '修改' },
				{ k: '@delete', title: '删除' }
			].map(({ k, title: t }) => ({
				title: t + routeTitle,
				key: key + k,
				description: t + routeTitle + '信息'
			}))

			for (const { title, key, description } of list) {
				await insertStmt.execute([title, key, description, lastInsertId])
			}
		}
		await connection.commit()
	} catch (error) {
		console.error(error)
		await connection.rollback()
	} finally {
		await connection.end()
	}
}
