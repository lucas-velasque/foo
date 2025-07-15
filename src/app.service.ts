// src/app.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiRootMessage(): string {
    return 'Welcome to the Aluguel Social API!';
  }
}