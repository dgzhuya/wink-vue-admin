import { resolve } from 'path'
import { setConfigPath } from '@/config'
import { readFileSync } from 'fs'
import { analyse } from '@/lexer'
import { nodeParser } from '@/parser'
import { translate } from '@/gen'

const path = resolve(__dirname, '../../../sources/model.wks')
setConfigPath({ outDir: '../api/src/', appModulePath: '../api/src/app.module.ts', outVueDir: './example' })
const source = readFileSync(path).toString()
const result = analyse(source)
if (!result.error) {
	nodeParser(result.data).then(node => {
		translate(node)
	})
}
