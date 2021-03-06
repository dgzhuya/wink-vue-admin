const keywords = ['#name', '#way', '#model', '#dto', '#api', '#table', '#form', '#router', '#comment', '#description']

const Scalar = [
	'@id',
	'@number',
	'@boolean',
	'@nullable',
	'@string',
	'@get',
	'@post',
	'@delete',
	'@update',
	'@all',
	'@DateEntity',
	'@comment',
	'@date',
	'@textarea'
]

export const isKeyWord = (word: string) => keywords.includes(word)

export const isScalar = (word: string) => Scalar.includes(word)
