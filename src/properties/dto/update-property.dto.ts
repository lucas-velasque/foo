import { IsString, IsNumber, Min, IsUUID, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { PaymentType, AvailabilityPeriod } from '../entities/property.entity';

export class UpdatePropertyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  @Min(1) 
  daily_work_hours_required?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsEnum(PaymentType)
  payment_type?: PaymentType;

  @IsOptional()
  @IsEnum(AvailabilityPeriod)
  availability_period?: AvailabilityPeriod;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsUUID() 
  social_assistance_id?: string;
}
