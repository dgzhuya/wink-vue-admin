import { analyse } from '../src/lexer'
import { resolve } from 'path'
import { readFileSync } from 'fs'

it('lexer analyse', () => {
	const path = resolve(__dirname, '../src/example/model.txt')
	const source = readFileSync(path).toString()
	const result = analyse(source)
	if (!result.error) {
		console.log(result.data)
	}
})
