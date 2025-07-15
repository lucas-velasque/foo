// src/shared/dtos/base.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class BaseDto {
  @IsOptional()
  @IsString()
  createdAt?: string;

  @IsOptional()
  @IsString()
  updatedAt?: string;
}