import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);
  await app.listen(process.env.port ?? 6000);
  // console log localhost url  console.log(`Auth Service is running on http://localhost:${process.env.PORT ?? 5000}`);
  console.log(`Auth Service is running on http://localhost:${process.env.PORT ?? 6000}`);
}
bootstrap();
