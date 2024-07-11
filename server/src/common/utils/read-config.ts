import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { parse } from 'toml'

type SQLType = 'mysql' | 'sqlite'

type Database<T extends SQLType> = T extends 'mysql'
	? {
			type: T
			host: string
			port: number
			username: string
			password: string
			database: string
		}
	: T extends 'sqlite'
		? {
				type: T
				path: string
			}
		: never

type ConfigStruct<T extends SQLType> = {
	database?: Database<T>
}

const localFilePath = resolve(__dirname, '../../../.config.local.toml')
const filePath = resolve(__dirname, '../../../.config.toml')

function readConfig(path: string, result: Object) {
	if (!existsSync(path)) {
		return
	}
	const content = readFileSync(path, 'utf-8')
	try {
		const config = parse(content)
		if (config) {
			for (const key in config) {
				if (Object.prototype.hasOwnProperty.call(config, key)) {
					const val = config[key]
					if (val) {
						result[key] = val
					}
				}
			}
		}
	} catch (error) {
		console.error(`解析配置文件${path}失败文件失败`)
		process.exit()
	}
}

function getConfig() {
	const result = {}
	readConfig(filePath, result)
	readConfig(localFilePath, result)
	return result
}

export function getDataType(): SQLType {
	const config = getConfig() as ConfigStruct<SQLType>
	if (!config.database) {
		console.error('缺少数据库配置信息')
		process.exit(0)
	}
	if (!['mysql', 'sqlite'].includes(config.database.type)) {
		console.error(`数据库类型不能为此配置${config.database.type}`)
		process.exit(0)
	}
	return config.database.type
}

export function getDatabase<T extends SQLType>(_: T): Database<T> {
	const config = getConfig() as ConfigStruct<T>
	if (!config.database) {
		console.error('缺少数据库配置信息')
		process.exit(0)
	}
	return config.database
}
