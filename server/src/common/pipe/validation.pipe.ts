import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform, Type } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'

@Injectable()
export class ValidationPipe implements PipeTransform {
	async transform(value: any, { metatype }: ArgumentMetadata) {
		if (!metatype || ValidationPipe.toValidate(metatype)) {
			return value
		}
		const object = plainToInstance(metatype, value)
		const [error] = await validate(object)
		if (error !== undefined) {
			throw new BadRequestException(ValidationPipe.getErrorMessage(error))
		}
		return value
	}

	private static getErrorMessage(error: ValidationError): string {
		return error.constraints[Object.keys(error.constraints).pop()]
	}

	private static toValidate(metatype: Type): boolean {
		const types: Type[] = [String, Boolean, Number, Array, Object]
		return types.includes(metatype)
	}
}
