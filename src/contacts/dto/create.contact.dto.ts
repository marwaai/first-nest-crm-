import { IsString, IsNotEmpty, IsEmail, IsOptional, IsPhoneNumber, IsUUID } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty({ message: 'Contact name is required' })
  name: string;

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