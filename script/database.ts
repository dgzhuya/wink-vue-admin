import { initMySql } from 'tools/init-sql/mysql'
import { getDataType } from '../tools/data-config'
import { initSqlite } from 'tools/init-sql/sqlite'

const type = getDataType()

if (type === 'mysql') {
	initMySql()
}
if (type === 'sqlite') {
	initSqlite()
}
