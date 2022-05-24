import { Token } from '@/lexer/Token'
import { NodeType } from './NodeType'

export class ASTNode {
	children: ASTNode[] = []
	parent: ASTNode | null = null
	lexeme: Token | null = null
	value = ''
	type: NodeType

	constructor(_type: NodeType) {
		this.type = _type
	}

	addChild(node: ASTNode) {
		node.parent = this
		this.children.push(node)
	}

	setLexeme(_token: Token) {
		this.lexeme = _token
		this.value = _token.getValue()
	}

	findByKey(key: string): ASTNode | null {
		if (this.value === key) {
			return this.parent
		}
		if (this.children.length > 0) {
			let result: ASTNode | null = null
			for (let i = 0; i < this.children.length; i++) {
				result = this.children[i].findByKey(key)
				if (result !== null) {
					break
				}
			}
			return result
		}
		return null
	}
}
