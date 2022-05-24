import { ASTNode } from './ASTNode'
import { NodeType } from './NodeType'
import { Factor } from './Factor'
import { Expr } from './Expr'
import { Block } from './Block'
import { isScalar } from '@/lexer/Keyword'
import { TokenIterator } from '../utils/TokenIterator'
import { Translate } from '../utils/Types'

export class AssignStmt extends ASTNode {
	constructor() {
		super(NodeType.ASSIGN_STMT)
	}

	static parser(it: TokenIterator) {
		const stmt = new AssignStmt()
		const factor = Factor.parser(it)
		stmt.addChild(factor)
		if (isScalar(factor.value)) {
			return stmt
		}
		const lookahead = it.next()
		if (lookahead.getValue() === '{') {
			const block = Block.parser(it)
			stmt.addChild(block)
		}
		if (lookahead.getValue() === ':') {
			const expr = Expr.parser(it)
			stmt.addChild(expr)
		}

		return stmt
	}

	getAssignValue() {
		const result: Translate = {}
		if (this.children.length > 0) {
			const key = this.children[0].value || 'key'
			if (this.children[0].type === NodeType.SCALAR) {
				result[key] = key
			}
			if (this.children[0].type === NodeType.VARIABLE && this.children.length > 1) {
				if (this.children[1].type === NodeType.EXPR) {
					result[key] = (this.children[1] as Expr).getChildVal()
				}
				if (this.children[1].type === NodeType.BLOCK) {
					result[key] = (this.children[1] as Block).getBlockValue()
				}
			}
		}
		return result
	}
}
