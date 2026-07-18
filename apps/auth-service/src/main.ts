import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import { ConfigService } from '@nestjs/config';
import { SERVICE_PORTS } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('AUTH_SERVICE_PORT') ?? SERVICE_PORTS.AUTH_SERVICE;

  await app.listen(port);
  console.log(`Auth Service is running on http://localhost:${port}`);
}
bootstrap();
