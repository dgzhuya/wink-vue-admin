import Database from 'better-sqlite3'
import { join } from 'path'
import { existsSync, writeFileSync, rmSync, readFileSync } from 'fs'
import { getDatabase } from '../data-config'

export function initSqlite() {
	const { path } = getDatabase('sqlite')

	const dbPath = join(__dirname, '../../server', path)
	const dataPath = join(__dirname, 'sqlite_data.sql')

	if (existsSync(dbPath)) {
		rmSync(dbPath)
		writeFileSync(dbPath, '')
	}
	const db = new Database(dbPath, { timeout: 400000, verbose: console.log })
	const initSql = readFileSync(dataPath, 'utf-8')
	db.exec(initSql)
	db.close()
}
