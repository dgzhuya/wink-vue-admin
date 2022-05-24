import { resolve } from 'path'
import { readFileSync } from 'fs'
import { analyse } from './lexer'
import { nodeParser } from './parser'
import { translate } from './gen'
import { setConfigPath } from './config'

const path = resolve('/Users/pinktu/Desktop/develop/wink-vue-admin/sources/model.txt')
setConfigPath({ outDir: './' })
const source = readFileSync(path).toString()
const result = analyse(source)
if (!result.error) {
	nodeParser(result.data).then(node => {
		translate(node)
	})
}
