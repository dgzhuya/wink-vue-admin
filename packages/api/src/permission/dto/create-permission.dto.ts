import { IsNumber, IsOptional } from 'class-validator'
import { UpdatePermissionDto } from './update-permission.dto'

export class CreatePermissionDto extends UpdatePermissionDto {
	@IsOptional()
	@IsNumber({ allowNaN: false }, { message: '上级权限信息' })
	readonly parentId?: number
}
