import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateSocialAssistanceDto {
  @IsNotEmpty()
  @IsString()
  ong_name: string = '';

  @IsNotEmpty()
  @IsString()
  contact_person: string = '';

  @IsNotEmpty()
  @IsEmail()
  contact_email: string = '';

  @IsOptional()
  @IsString()
  contact_phone?: string;

  @IsOptional()
  @IsString()
  description: string = '';
}