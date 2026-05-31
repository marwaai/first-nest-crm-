import { IsString, IsNotEmpty, IsOptional, IsArray, IsInt } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty({ message: 'اسم الرول مطلوب' })
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty({ message: 'حقل الصلاحيات يجب أن يرسل حتى لو كان فارغاً' })
  // @ArrayMinSize(1) // أضيفي هذا السطر فقط إذا كنتِ ترفضين المصفوفة الفارغة []
  permissionIds!: number[]; // غيرنا ? لـ ! لأنها لم تعد اختيارية في الـ Validator
}