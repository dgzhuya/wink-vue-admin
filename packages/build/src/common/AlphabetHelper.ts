export class AlphabetHelper {
	static isNumber(ch: string) {
		return ch >= '0' && ch <= '9'
	}

	static isLetter(ch: string) {
		return (ch >= 'A' && ch <= 'Z') || (ch >= 'a' && ch <= 'z') || ch === '#' || ch === '@'
	}

	static isWhiteSpace(ch: string) {
		return ch === ' ' || ch === '\n' || ch === '\t'
	}

	static isOperator(ch: string) {
		return /^[*+\-<>=!&|^%/,]*$/.test(ch)
	}
}
