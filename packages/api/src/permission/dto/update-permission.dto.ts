import { PartialType } from '@nestjs/mapped-types'
import { Permission } from '@/permission/entities/permission.entity'

export class UpdatePermissionDto extends PartialType(Permission) {}
