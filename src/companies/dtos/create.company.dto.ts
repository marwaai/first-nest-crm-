import { 
  IsString, 
  IsOptional, 
  IsArray, 
  ArrayMinSize, 
  ValidateNested, 
  IsNotEmpty,
  IsUrl
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateContactDto } from '../../contacts/dto/create.contact.dto';
import { CreateDealDto } from '../../deals/dto/create.deals.dto'; // Assuming this exists
export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsString()
  country?: string;
@IsOptional()
  @IsArray()
  //@ArrayMinSize(1, { message: 'A company must be created with at least one contact.' })
  @ValidateNested({ each: true })
  @Type(() => CreateContactDto)
  contacts?: CreateContactDto[];

  // Deals: OPTIONAL
  @IsOptional() // This allows the field to be missing entirely
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDealDto)
  deals?: CreateDealDto[]; 
}