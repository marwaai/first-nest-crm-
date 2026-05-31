import { IsString, IsNotEmpty, IsEmail, IsOptional, IsPhoneNumber, IsUUID } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string; // تم التعديل هنا

  @IsString()
  @IsOptional()
  lastName?: string; // تم التعديل هنا

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  @IsPhoneNumber(undefined, { message: 'Please provide a valid phone number' })
  phone?: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsUUID()
  @IsOptional()
  ownerId?: string;
}