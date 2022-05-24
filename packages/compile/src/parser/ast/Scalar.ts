import { NodeType } from './NodeType'
import { ASTNode } from './ASTNode'
import { Token } from '@/lexer/Token'

export class Scalar extends ASTNode {
	constructor(token: Token) {
		super(NodeType.SCALAR)
		this.setLexeme(token)
	}
}
