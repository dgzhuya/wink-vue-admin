import { Token } from '@/lexer/Token'
import { ASTNode } from './ast/ASTNode'
import { NodeType } from './ast/NodeType'
import { AssignStmt } from './ast/AssignStmt'
import { TokenIterator } from './utils/TokenIterator'

export const nodeParser = async (tokens: Token[]) => {
	const it = new TokenIterator(tokens)
	const astNode = new ASTNode(NodeType.PROGRAM)
	let token = it.next()
	while (it.hasNext()) {
		if (token.isFactor()) {
			it.putBack()
			const node = await AssignStmt.parser(it)
			astNode.addChild(node)
		}
		token = it.next()
	}
	return astNode
}
