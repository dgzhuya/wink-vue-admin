import { getDataType } from 'tools/data-config'
import { insertToMysql } from 'tools/insert/mysql'
import { insertToSqlite } from 'tools/insert/sqlite'

const args = process.argv.slice(2)

if (args.length < 2) {
	console.error('参数错误')
	process.exit(0)
}
const type = getDataType()

const isDelete = args.length === 3 && args[2] === '-d'
const path = args[0]
const title = args[1]

if (type === 'mysql') {
	insertToMysql(path, title, isDelete)
}
if (type === 'sqlite') {
	insertToSqlite(path, title, isDelete)
}

console.log('执行成功')
