import { createConnection } from 'mysql2/promise'
import { join } from 'path'
import { readFileSync } from 'fs'
import { getDatabase } from '../data-config'

export async function initMySql() {
	const { host, username: user, password, database, port } = getDatabase('mysql')

	const dataPath = join(__dirname, 'mysql_data.sql')

	const connection = await createConnection({
		host,
		user,
		port,
		password,
		database
	})
	const initSqls = readFileSync(dataPath, 'utf-8')
		.split(';')
		.filter(s => s)
	const list = []
	for (const statement of initSqls) {
		const trimmedStatement = statement.trim()
		if (trimmedStatement) {
			list.push(connection.execute(trimmedStatement))
		}
	}
	try {
		await Promise.all(list)
	} catch (error) {
		console.error('Failed to execute SQL statement: ', error)
	}
	console.log('初始化数据库成功')
	connection.end()
}
