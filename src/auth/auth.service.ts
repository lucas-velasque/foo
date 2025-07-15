// src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    // Buscar usuário por e-mail ou CPF
    const user = loginDto.login.includes('@')
      ? await this.usersService.findByEmail(loginDto.login)
      : await this.usersService.findByCpf(loginDto.login);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    // Remover validação de role - o login é baseado apenas no email/CPF e senha
    // Validar senha
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha inválida');
    }
    // Gerar token JWT
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = await this.jwtService.signAsync(payload);
    return {
      access_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        role: user.role,
      },
    };
  }
}