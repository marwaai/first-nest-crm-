import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './signup.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../user.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole; // Now the Admin can send a new role here
}