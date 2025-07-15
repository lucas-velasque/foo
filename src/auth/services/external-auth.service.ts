import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class ExternalAuthService {
  private readonly logger = new Logger(ExternalAuthService.name);
  private readonly client: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.client = axios.create({
      baseURL: this.configService.get<string>('externalAuth.baseUrl'),
      timeout: this.configService.get<number>('externalAuth.timeout'),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para logging de requisições
    this.client.interceptors.request.use(
      (config) => {
        this.logger.debug(`Making request to ${config.url}`);
        return config;
      },
      (error) => {
        this.logger.error('Request error:', error);
        return Promise.reject(error);
      },
    );

    // Interceptor para logging de respostas
    this.client.interceptors.response.use(
      (response) => {
        this.logger.debug(`Response from ${response.config.url}: ${response.status}`);
        return response;
      },
      (error) => {
        this.logger.error('Response error:', error.response?.data || error.message);
        return Promise.reject(error);
      },
    );
  }

  async validateToken(token: string): Promise<any> {
    try {
      const response = await this.client.post('/validate', {
        token,
        clientId: this.configService.get<string>('externalAuth.clientId'),
        clientSecret: this.configService.get<string>('externalAuth.clientSecret'),
      });
      return response.data;
    } catch (error) {
      this.logger.error('Error validating token:', error);
      throw error;
    }
  }

  async login(credentials: { username: string; password: string }): Promise<any> {
    try {
      const response = await this.client.post('/login', {
        ...credentials,
        clientId: this.configService.get<string>('externalAuth.clientId'),
        clientSecret: this.configService.get<string>('externalAuth.clientSecret'),
      });
      return response.data;
    } catch (error) {
      this.logger.error('Error during login:', error);
      throw error;
    }
  }
} 