import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar ValidationPipe global
  app.useGlobalPipes(new ValidationPipe({
    transform: false, // Desabilitado temporariamente para evitar transformação automática de Date
    whitelist: true,
    forbidNonWhitelisted: false, // Temporariamente desabilitado para debug
    errorHttpStatusCode: 422,
  }));

  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Aluguel Social')
    .setDescription('API para o sistema de Aluguel Social - Gerenciamento de propriedades e assistência social')
    .setVersion('1.0')
    .addTag('auth', 'Endpoints de autenticação')
    .addTag('users', 'Gerenciamento de usuários')
    .addTag('properties', 'Gerenciamento de propriedades')
    .addTag('bookings', 'Gerenciamento de reservas')
    .addTag('work-credits', 'Gerenciamento de créditos de serviço')
    .addTag('social-assistance', 'Gerenciamento de assistência social')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);

  // Log manual das rotas mapeadas
  const server = app.getHttpServer();
  const router = server._events.request._router;
  if (router && router.stack) {
    console.log('--- Rotas mapeadas ---');
    router.stack.forEach((layer: any) => {
      if (layer.route) {
        const path = layer.route?.path;
        const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
        console.log(`${methods} ${path}`);
      }
    });
    console.log('----------------------');
  }
}
bootstrap();
