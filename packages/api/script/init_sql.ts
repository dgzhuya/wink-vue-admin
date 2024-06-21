import * as Database from 'better-sqlite3'
import { join } from 'path'
import { existsSync, writeFileSync, rmSync, readFileSync } from 'fs'

const dbPath = join(__dirname, '..', 'admin.db')
const dataPath = join(__dirname, 'data.sql')

if (existsSync(dbPath)) {
	rmSync(dbPath)
	writeFileSync(dbPath, '')
}
const db = new Database(dbPath, { timeout: 400000, verbose: console.log })
const initSql = readFileSync(dataPath, 'utf-8')
db.exec(initSql)
db.close()
