// src/modules/users/dto/create-user.dto.ts
import { IsNotEmpty, IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string = '';

  @IsNotEmpty()
  @IsString()
  cpf: string = '';

  @IsNotEmpty()
  @IsEmail()
  email: string = '';

  @IsNotEmpty()
  @IsString()
  password: string = '';

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.USER; // Por padrão, o usuário é um 'user'
}