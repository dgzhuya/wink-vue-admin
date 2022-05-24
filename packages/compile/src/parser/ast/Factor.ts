import { TokenIterator } from '../utils/TokenIterator'
import { ASTNode } from './ASTNode'
import { Scalar } from './Scalar'
import { Variable } from './Variable'

export class Factor extends ASTNode {
	static parser(it: TokenIterator) {
		const token = it.next()
		if (token.isScalar()) {
			return new Scalar(token)
		}
		return new Variable(token)
	}
}
