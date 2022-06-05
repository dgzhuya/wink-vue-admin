import { ASTNode } from '@/parser/ast/ASTNode'
import { NodeType } from '@/parser/ast/NodeType'
import { TokenIterator } from '@/parser/utils/TokenIterator'
import { Factor } from '@/parser/ast/Factor'
import { Expr } from '@/parser/ast/Expr'

export class CallExpr extends ASTNode {
	constructor() {
		super(NodeType.CALL_EXPR)
	}

	static parser(it: TokenIterator) {
		const callExpr = new CallExpr()
		const factor = Factor.parser(it)
		callExpr.addChild(factor)
		it.nextMatch('(')
		const params = Expr.parser(it)
		callExpr.addChild(params)
		it.nextMatch(')')
		return callExpr
	}

	getCallVal() {
		const params = this.children[1].children[0].value
		return this.children[1] ? `comment:${params}` : ''
	}
}
