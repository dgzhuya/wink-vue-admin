import { ASTNode } from './ASTNode'
import { NodeType } from './NodeType'
import { AssignStmt } from './AssignStmt'
import { TokenIterator } from '../utils/TokenIterator'
import { Translate } from '../utils/Types'

export class Block extends ASTNode {
	constructor() {
		super(NodeType.BLOCK)
	}

	static parser(it: TokenIterator) {
		const block = new Block()
		while (it.hasNext()) {
			const assignNode = AssignStmt.parser(it)
			block.addChild(assignNode)
			if (it.peek().getValue() === '}') {
				it.nextMatch('}')
				break
			}
		}
		return block
	}

	getBlockValue() {
		const result: Translate = {}
		if (this.children.length > 0) {
			for (let i = 0; i < this.children.length; i++) {
				const child = this.children[i]
				if (child.type === NodeType.ASSIGN_STMT) {
					Object.assign(result, (child as AssignStmt).getAssignValue())
				}
			}
		}
		return result
	}
}
