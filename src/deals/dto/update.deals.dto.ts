import { PartialType } from '@nestjs/mapped-types';
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
import {CreateDealDto} from "./create.deals.dto"
export class UpdateDealDto extends PartialType(CreateDealDto) {
  @IsOptional()
  @IsString()
  lostReason?: string; // الحقل ده غالباً بنحتاجه بس لما الحالة تتغير لـ CLOSED_LOST

  @IsOptional()
  @IsDateString()
  actualCloseDate?: Date;
}