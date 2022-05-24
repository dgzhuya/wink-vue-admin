import { PeekIterator } from '@/common/PeekIterator'
import { Token } from '@/lexer/Token'

export class TokenIterator extends PeekIterator<Token> {
	nextMatch(val: string) {
		if (this.peek().getValue() !== val) {
			throw new Error('Token error')
		}
		this.next()
	}
}
