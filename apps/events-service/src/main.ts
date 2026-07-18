import { NestFactory } from '@nestjs/core';
import { EventsServiceModule } from './events-service.module';
import { ConfigService } from '@nestjs/config';
import { SERVICE_PORTS } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(EventsServiceModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('EVENTS_SERVICE_PORT') ?? SERVICE_PORTS.EVENT_SERVICE;

  await app.listen(port);
  console.log(`Events Service is running on http://localhost:${port}`);
}
bootstrap();
