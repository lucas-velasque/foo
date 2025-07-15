import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum, IsBoolean, Min, IsUUID } from 'class-validator';
import { PaymentType, AvailabilityPeriod } from '../entities/property.entity';

export class CreatePropertyDto {
  @IsNotEmpty()
  @IsString()
  name: string = '';

  @IsNotEmpty()
  @IsString()
  location: string = '';

  @IsOptional()
  @IsNumber()
  @Min(1)
  daily_work_hours_required?: number = 4;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsEnum(PaymentType)
  payment_type?: PaymentType = PaymentType.WORK_HOURS;

  @IsOptional()
  @IsEnum(AvailabilityPeriod)
  availability_period?: AvailabilityPeriod = AvailabilityPeriod.NIGHTLY;

  @IsOptional()
  @IsString()
  description?: string = '';

  @IsOptional()
  @IsBoolean()
  is_active?: boolean = true;

  @IsOptional()
  @IsString()
  owner_id?: string;

  @IsOptional()
  @IsString()
  social_assistance_id?: string;
}