import { setConfigPath } from '@/config'
import { translate } from '@/gen'
import { analyse } from '@/lexer'
import { nodeParser } from '@/parser'
import { readFileSync } from 'fs'
import { resolve } from 'path'

it('gen module', () => {
	const path = resolve(__dirname, '../../../sources/model.txt')
	setConfigPath({ outDir: '../api/src/', appModulePath: '../api/src/app.module.ts' })
	const source = readFileSync(path).toString()
	const result = analyse(source)
	if (!result.error) {
		nodeParser(result.data).then(node => {
			translate(node)
		})
	}
})
