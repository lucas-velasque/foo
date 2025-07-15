import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthIntegrationService } from './services/auth-integration.service';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authIntegrationService: AuthIntegrationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token não fornecido');
    }

    const isValid = await this.authIntegrationService.validateToken(token);
    if (!isValid) {
      throw new UnauthorizedException('Token inválido');
    }

    // Obtém informações do usuário do controle-users-dev
    const userInfo = await this.authIntegrationService.checkToken(token);
    request['user'] = userInfo;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
