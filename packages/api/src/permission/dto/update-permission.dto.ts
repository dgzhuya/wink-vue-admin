import { PartialType } from '@nestjs/mapped-types'
import { PermissionEntity } from '@api/permission/entities/permission.entity'

export class UpdatePermissionDto extends PartialType(PermissionEntity) {}
