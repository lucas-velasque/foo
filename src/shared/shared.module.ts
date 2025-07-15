// src/shared/shared.module.ts
import { Module } from '@nestjs/common';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    LoggerMiddleware, // Make the middleware injectable
  ],
  exports: [LoggerMiddleware], // Export if you want to use it in other modules via import
})
export class SharedModule {}