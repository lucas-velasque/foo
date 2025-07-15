import { IsNotEmpty, IsUUID, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreditType } from '../enums/credit-type.enum'; 
import { Transform } from 'class-transformer';

export class CreateWorkCreditDto {
  @IsNotEmpty()
  @IsEnum(CreditType)
  type!: CreditType;

  @IsNotEmpty()
  @IsNumber()
  hours!: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value) 
  date?: string;

  @IsNotEmpty()
  @IsUUID()
  user_id!: string;
}