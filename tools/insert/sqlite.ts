import Database from 'better-sqlite3'
import { existsSync } from 'fs'
import { join } from 'path'
import { getDatabase } from 'tools/data-config'

function findIdByKey(key: string, select: Database.Statement) {
	const result = select.get(key) as { id: number | bigint }
	return result ? result.id : undefined
}

export function insertToSqlite(routePath: string, routeTitle: string, isDelete = false) {
	const { path } = getDatabase('sqlite')
	const dataFile = join(__dirname, '../../server', path)
	if (!existsSync(dataFile)) {
		console.error('数据库文件不存在')
		return
	}
	const db = new Database(dataFile)
	const selectStmt = db.prepare(`SELECT id FROM w_permission WHERE key = ?`)
	const insertStmt = db.prepare(
		`INSERT INTO w_permission (title, key, description, pid) VALUES (@title, @key, @description, @pid)`
	)

	const deleteStmt = db.prepare(`DELETE FROM w_permission WHERE key = ?`)

	const hasPremissionTbl = db.exec(`SELECT name FROM sqlite_master WHERE type='table' AND name= w_permission `)
	if (!hasPremissionTbl) {
		console.error('权限表不存在')
		db.close()
		return
	}
	const pathList = routePath.split('/').filter(p => p)
	const prefixKey = pathList.length > 1 ? '#' + pathList[0].replaceAll('-', '_') : ''

	let pid: null | number | bigint = null
	if (prefixKey) {
		const id = findIdByKey(prefixKey, selectStmt)
		if (!id) {
			console.error(`父级权限${prefixKey}不存在`)
			db.close()
			return
		}
		pid = id
	}
	const key = '#' + pathList.join('_').replaceAll('-', '_')

	let fn: Database.Transaction<() => void>
	if (isDelete) {
		const list = ['@add', '@update', '@delete'].map(k => key + k)
		fn = db.transaction(() => {
			for (const k of list) {
				deleteStmt.run(k)
			}
			deleteStmt.run(key)
		})
	} else {
		const keyId = findIdByKey(key, selectStmt)
		if (keyId) {
			console.error(`当前权限${key}已存在`)
			db.close()
			return
		}
		const list = [
			{ k: '@add', title: '添加' },
			{ k: '@update', title: '修改' },
			{ k: '@delete', title: '删除' }
		].map(({ k, title: t }) => ({
			title: t + routeTitle,
			key: key + k,
			description: t + routeTitle + '信息'
		}))
		fn = db.transaction(() => {
			const { lastInsertRowid } = insertStmt.run({
				key,
				title: routeTitle,
				description: `${routeTitle}页面查看`,
				pid
			})
			for (const item of list) {
				insertStmt.run({ ...item, pid: lastInsertRowid })
			}
		})
	}
	try {
		fn()
	} catch (error) {
		console.error(error)
		db.close()
		return
	}
}
