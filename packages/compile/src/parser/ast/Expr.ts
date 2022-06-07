import { ASTNode } from './ASTNode'
import { NodeType } from './NodeType'
import { Factor } from './Factor'
import { TokenIterator } from '../utils/TokenIterator'
import { CallExpr } from '@/parser/ast/CallExpr'

export class Expr extends ASTNode {
	constructor() {
		super(NodeType.EXPR)
	}

	static parser(it: TokenIterator) {
		const expr = new Expr()
		while (it.hasNext()) {
			const factorNode = Factor.parser(it)
			expr.addChild(factorNode)
			it.next()
			let lookahead = it.peek()
			it.putBack()
			if (lookahead.getValue() === '(') {
				const callExpr = CallExpr.parser(it)
				expr.addChild(callExpr)
			}
			const lexeme = it.next()
			lookahead = it.peek()
			it.putBack()
			if (!lexeme.isFactor() || !lookahead.isFactor()) {
				break
			}
		}
		return expr
	}

	getChildVal() {
		return this.children.map(child =>
			child.type === NodeType.CALL_EXPR ? (child as CallExpr).getCallVal() : child.value
		)
	}
}
