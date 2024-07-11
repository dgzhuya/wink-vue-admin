import { createConnection } from 'mysql2'
import { join } from 'path'
import { readFileSync } from 'fs'
import { getDatabase } from '../data-config'

export function initMySql() {
	const { host, username, password, database } = getDatabase('mysql')

	const dataPath = join(__dirname, 'mysql_data.sql')

	const connection = createConnection({
		host,
		user: username,
		password,
		database
	})
	const initSqls = readFileSync(dataPath, 'utf-8')
		.split(';')
		.filter(s => s)
	for (const statement of initSqls) {
		const trimmedStatement = statement.trim()
		if (trimmedStatement) {
			try {
				connection.execute(trimmedStatement)
			} catch (error) {
				console.error(`Failed to execute SQL statement: ${trimmedStatement}`, error)
			}
		}
	}
	connection.end()
}
