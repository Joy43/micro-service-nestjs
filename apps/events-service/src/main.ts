import { NestFactory } from '@nestjs/core';
import { EventsServiceModule } from './events-service.module';
import { ConfigService } from '@nestjs/config';
import { SERVICE_PORTS } from '@app/common';
import { ValidationPipe } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { KAFKA_BROKER, KAFKA_CLIENT_ID } from '@app/kafka/constant/kafka.constants';

async function bootstrap() {
  const app = await NestFactory.create(EventsServiceModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('EVENTS_SERVICE_PORT') ?? SERVICE_PORTS.EVENT_SERVICE;
  const kafkaBroker = configService.get<string>('KAFKA_BROKER') ?? KAFKA_BROKER;

  const swaggerConfig = new DocumentBuilder()
    .setTitle('EventFlow Events Service API')
    .setDescription('Events Management & Catalog Microservice Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: `${KAFKA_CLIENT_ID}-events`,
        brokers: [kafkaBroker],
      },
      consumer: {
        groupId: 'events-service-consumer',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(port);
  console.log(`Events Service is running on http://localhost:${port}/api/docs and connected to Kafka (${kafkaBroker})`);
}
bootstrap();
