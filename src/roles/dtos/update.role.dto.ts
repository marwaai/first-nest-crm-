import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create.role.dto';
import { IsOptional, IsArray, IsInt } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  permissionIds?: number[]; // نكتفي بـ ? لأنها منطقية في التحديث
}