// src/modules/auth/dto/login.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  login: string = ''; // Pode ser e-mail ou CPF

  @IsNotEmpty()
  @IsString()
  password: string = '';
}