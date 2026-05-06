import { 
  IsString, 
  IsNotEmpty, 
  IsNumber, 
  IsEnum, 
  IsOptional, 
  IsUUID, 
  IsDateString, 
  Min, 
  Max, 
  IsObject
} from 'class-validator';
import { DealStage, DealPriority } from '../deal.entity';

export class CreateDealDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @Min(0)
  value: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsEnum(DealStage)
  @IsOptional()
  stage?: DealStage;

  @IsEnum(DealPriority)
  @IsOptional()
  priority?: DealPriority;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  probability?: number;

  @IsDateString()
  @IsOptional()
  expectedCloseDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsObject()
  @IsOptional()
  customFields?: Record<string, any>;

  // Relational IDs
  @IsUUID()
  @IsOptional()
  contactId?: string;

  @IsUUID()
  @IsOptional()
  companyId?: string;

  @IsUUID()
  @IsOptional()
  ownerId?: string;
}