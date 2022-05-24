import { resolve } from 'path'
import { readFileSync } from 'fs'
import { analyse } from './lexer'
import { nodeParser } from './parser'
import { translate } from './gen'
import { setConfigPath } from './config'

const path = resolve(__dirname, '../../../sources/model.txt')
setConfigPath({ outDir: '../api/src/' })
const source = readFileSync(path).toString()
const result = analyse(source)
if (!result.error) {
	nodeParser(result.data).then(node => {
		translate(node)
	})
}
