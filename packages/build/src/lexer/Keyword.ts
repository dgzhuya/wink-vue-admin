const keywords = ['#name', '#way', '#model', '#dto', '#api']

const Scalar = ['@id', '@number', '@boolean', '@nullable', '@dto', '@string', '@get', '@post', '@delete', '@update']

export const isKeyWord = (word: string) => keywords.includes(word)

export const isScalar = (word: string) => Scalar.includes(word)
