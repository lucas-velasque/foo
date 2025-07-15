import { IsString, IsOptional, IsEmail } from 'class-validator';

export class UpdateSocialAssistanceDto {
  @IsOptional()
  @IsString()
  ong_name?: string;

  @IsOptional()
  @IsString()
  contact_person?: string;

  @IsOptional()
  @IsEmail()
  contact_email?: string;

  @IsOptional()
  @IsString()
  contact_phone?: string;

  @IsOptional()
  @IsString()
  description?: string;
}