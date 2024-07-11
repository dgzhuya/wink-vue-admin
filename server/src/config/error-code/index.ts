import ParamsError from './params-code'
import ServerError from './server-code'

export type ParamsErrorCode = keyof typeof ParamsError
export type ServerErrorErrorCode = keyof typeof ServerError

export { ParamsError, ServerError }
