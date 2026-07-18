import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { KafkaModule } from '@app/kafka';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewayAuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    AppConfigModule,
    KafkaModule.register('api-gateway-group'),
    GatewayAuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
