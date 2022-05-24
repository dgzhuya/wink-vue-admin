import { PeekIterator } from '@/common/PeekIterator'
import { Token } from './Token'
import { TokenKind } from './TokenKind'
import { AlphabetHelper } from '@/common/AlphabetHelper'
import { ResultWarp } from '@/common/ResultWarp'

export const analyse = (source: string): ResultWarp<Token[]> => {
	const iterator = new PeekIterator(source.split(''))
	const tokens: Token[] = []
	while (iterator.hasNext()) {
		let word = iterator.next()
		const lookahead = iterator.peek()
		if (word === ' ' || word === '\n') {
			continue
		}

		if (word === '/') {
			if (lookahead === '/') {
				while (iterator.hasNext()) {
					word = iterator.next()
					if (word === '\n') {
						break
					}
				}
			}
		}

		if (word === '{' || word === '}') {
			tokens.push(new Token(TokenKind.BRACKET, word))
			continue
		}

		if (word === ':') {
			tokens.push(new Token(TokenKind.ASSIGN, word))
			continue
		}

		if (word === '"' || word === "'") {
			tokens.push(Token.makeString(iterator))
		}

		if (AlphabetHelper.isLetter(word)) {
			iterator.putBack()
			tokens.push(Token.makeVarOrKeyword(iterator))
		}
	}
	return { data: tokens, error: '' }
}
