import { getDataType } from '../utils/read-config'
import { MysqlModule } from './mysql.module'
import { SQLiteModule } from './sqlite.module'

let DBModule = null

const dbType = getDataType()

if (dbType === 'mysql') {
	DBModule = MysqlModule
}
if (dbType === 'sqlite') {
	DBModule = SQLiteModule
}

export { DBModule }
