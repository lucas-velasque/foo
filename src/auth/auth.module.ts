// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { AuthGuard } from './auth.guard';
import { AuthIntegrationService } from './services/auth-integration.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GlobalAuthGuard } from './guards/global-auth.guard';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: 'aluguel_social', //configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, AuthIntegrationService, GlobalAuthGuard, JwtStrategy],
  exports: [AuthService, AuthGuard, AuthIntegrationService, GlobalAuthGuard],
})
export class AuthModule {}