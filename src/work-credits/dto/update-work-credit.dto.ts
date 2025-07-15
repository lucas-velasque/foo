import { IsOptional, IsUUID, IsEnum, IsNumber, IsString } from 'class-validator';
import { CreditType } from '../enums/credit-type.enum'; // <-- Importação CORRIGIDA
import { Transform } from 'class-transformer';

export class UpdateWorkCreditDto {
  @IsOptional()
  @IsEnum(CreditType)
  type?: CreditType;

  @IsOptional()
  @IsNumber()
  hours?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value) 
  date?: string;

  @IsOptional()
  @IsUUID()
  user_id?: string;
}