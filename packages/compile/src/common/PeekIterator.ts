export class PeekIterator<T = string> {
	private readonly iterator: T[]

	private tokenIndex = 0

	constructor(_iterator: T[]) {
		this.iterator = _iterator
	}

	peek(): T {
		return this.iterator[this.tokenIndex]
	}

	putBack() {
		this.tokenIndex--
	}

	hasNext() {
		return this.iterator.length - 1 > this.tokenIndex
	}

	next(): T {
		const token = this.peek()
		if (this.hasNext()) {
			this.tokenIndex++
		}
		return token
	}
}
