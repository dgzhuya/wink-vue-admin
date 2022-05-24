import { NodeType } from './NodeType'
import { Token } from '@/gen/lexer/Token'
import { ASTNode } from './ASTNode'

export class Scalar extends ASTNode {
	constructor(token: Token) {
		super(NodeType.SCALAR)
		this.setLexeme(token)
	}
}
