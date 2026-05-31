import { 
  IsEmail, 
  IsNotEmpty, 
  IsString, 
  MinLength, 
  IsOptional, 
  IsInt, 
  IsUrl 
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'الاسم الأول يجب أن يكون نصاً' })
  @IsNotEmpty({ message: 'الاسم الأول مطلوب' })
  firstName!: string;

  @IsString({ message: 'اسم العائلة يجب أن يكون نصاً' })
  @IsNotEmpty({ message: 'اسم العائلة مطلوب' })
  lastName!: string;

  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'كلمة المرور يجب أن لا تقل عن 8 أحرف' })
  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  password!: string;

}