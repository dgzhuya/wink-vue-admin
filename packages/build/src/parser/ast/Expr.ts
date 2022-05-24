import { ASTNode } from './ASTNode'
import { NodeType } from './NodeType'
import { Factor } from './Factor'
import { TokenIterator } from '@/utils/TokenIterator'

export class Expr extends ASTNode {
	constructor() {
		super(NodeType.EXPR)
	}

	static parser(it: TokenIterator) {
		const expr = new Expr()
		while (it.hasNext()) {
			const factorNode = Factor.parser(it)
			expr.addChild(factorNode)
			const lexeme = it.peek()
			if (!lexeme.isScalar()) {
				break
			}
		}
		return expr
	}

	getChildVal() {
		return this.children.map(child => child.value)
	}
}
