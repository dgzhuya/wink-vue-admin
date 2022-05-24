import { TokenKind } from './TokenKind'
import { PeekIterator } from '../common/PeekIterator'
import { AlphabetHelper } from '../common/AlphabetHelper'
import { isKeyWord, isScalar } from './Keyword'

export class Token {
	private readonly type: TokenKind
	private readonly value: string

	constructor(_type: TokenKind, _value: string) {
		this.type = _type
		this.value = _value
	}

	static makeVarOrKeyword(it: PeekIterator): Token {
		let tokenText = ''
		while (it.hasNext()) {
			const lookahead = it.peek()
			if (AlphabetHelper.isLetter(lookahead)) {
				tokenText += lookahead
			} else {
				break
			}
			it.next()
		}
		if (isKeyWord(tokenText)) {
			return new Token(TokenKind.KEYWORD, tokenText)
		}
		if (isScalar(tokenText)) {
			return new Token(TokenKind.SCALAR, tokenText)
		}
		return new Token(TokenKind.Identifier, tokenText)
	}

	static makeString(it: PeekIterator) {
		let wordText = ''
		while (it.hasNext()) {
			const lookahead = it.next()
			if (lookahead === "'" || lookahead === '"') {
				break
			}
			wordText += lookahead
		}
		return new Token(TokenKind.SCALAR, wordText)
	}

	getValue() {
		return this.value
	}

	getType() {
		return this.type
	}

	isFactor() {
		return this.isIdentifier() || this.isKeyWord() || this.isScalar()
	}

	isScalar() {
		return this.type === TokenKind.SCALAR
	}

	isKeyWord() {
		return this.type === TokenKind.KEYWORD
	}

	isIdentifier() {
		return this.type === TokenKind.Identifier
	}
}
