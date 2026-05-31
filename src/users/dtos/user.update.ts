import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './signup.dto'; 
import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer'; // <-- متنسيش الـ Import ده للـ كاستينج

// نستخدم OmitType لحذف الـ password من الـ CreateUserDto قبل جعل الباقي Optional
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password'] as const),
) {
  
  @IsOptional()
  @IsInt({ message: 'معرف الرول يجب أن يكون رقماً صحيحاً' }) // غيّرناها لـ IsInt عشان تناسب الـ number
  @Type(() => Number) // ✨ السطر السحري اللي بيحول أي String جاي من بره لـ number حقيقي
  roleId?: number; // التايب number سليم كدة 100%

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;
}