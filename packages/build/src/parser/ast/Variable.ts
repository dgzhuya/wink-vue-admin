import { NodeType } from './NodeType'
import { ASTNode } from './ASTNode'
import { Token } from '@/lexer/Token'

export class Variable extends ASTNode {
	constructor(token: Token) {
		super(NodeType.VARIABLE)
		this.setLexeme(token)
	}
}
