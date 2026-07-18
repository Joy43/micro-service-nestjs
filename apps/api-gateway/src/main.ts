import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SERVICE_PORTS } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('API_GATEWAY_PORT') ?? SERVICE_PORTS.API_GATEWAY;

  await app.listen(port);
  console.log(`API Gateway is running on http://localhost:${port}`);
}
bootstrap();
