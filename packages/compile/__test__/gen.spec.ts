import { setConfigPath } from '@/config'
import { translate } from '@/gen'
import { analyse } from '@/lexer'
import { nodeParser } from '@/parser'
import { readFileSync } from 'fs'

it('gen module', () => {
	setConfigPath({ nestDir: '../api/src/', webDir: '../web/src/' })
	const source = readFileSync('../../sources/model.wks').toString()
	const result = analyse(source)
	if (!result.error) {
		nodeParser(result.data).then(node => {
			translate(node)
		})
	}
})
