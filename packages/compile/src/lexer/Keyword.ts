const keywords = ['#name', '#way', '#model', '#dto', '#api']

const Scalar = ['@id', '@number', '@boolean', '@nullable', '@string', '@get', '@post', '@delete', '@update', '@all']

export const isKeyWord = (word: string) => keywords.includes(word)

export const isScalar = (word: string) => Scalar.includes(word)
