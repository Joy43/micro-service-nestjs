import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SERVICE_PORTS } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
// console log localhost url  console.log(`API Gateway is running on http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`API Gateway is running on http://localhost:${SERVICE_PORTS.API_GATEWAY}`);
}
bootstrap();
