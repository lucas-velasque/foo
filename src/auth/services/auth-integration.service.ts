import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import { LoginDto } from '../dto/login.dto';

interface ErrorResponse {
  message?: string;
}

@Injectable()
export class AuthIntegrationService {
  private readonly apiUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.apiUrl = this.configService.get<string>('CONTROLE_USERS_API_URL') || 'http://localhost:8000';
  }

  private handleError(error: AxiosError<ErrorResponse>, operation: string) {
    if (error.response) {
      throw new HttpException(
        `Erro ao ${operation} no controle-users: ${error.response.data?.message || error.message}`,
        error.response.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    throw new HttpException(
      `Erro ao ${operation} no controle-users: ${error.message}`,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      await axios.post(`${this.apiUrl}/auth/validate`, { token });
      return true;
    } catch (error) {
      this.handleError(error as AxiosError<ErrorResponse>, 'validar token');
      return false;
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const response = await axios.post(`${this.apiUrl}/auth/login`, loginDto);
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError<ErrorResponse>, 'realizar login');
    }
  }

  async checkToken(token: string) {
    try {
      const response = await axios.post(`${this.apiUrl}/auth/check`, { token });
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError<ErrorResponse>, 'verificar token');
    }
  }
} 