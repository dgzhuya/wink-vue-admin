import { resolve } from 'path'
import { readFileSync } from 'fs'
import { analyse } from '../src/lexer'
import { nodeParser } from '../src/parser'

it('ast node', async () => {
	const path = resolve(__dirname, '../src/example/model.wks')
	const source = readFileSync(path).toString()
	const result = analyse(source)
	if (!result.error) {
		const astNode = nodeParser(result.data)
		console.log(astNode)
	}
})
