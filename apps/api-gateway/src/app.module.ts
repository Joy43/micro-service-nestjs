import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { KafkaModule } from '@app/kafka';
import { GatewayAuthModule } from './modules/auth/auth.module';
import { GatewayEventsModule } from './modules/events/events.module';

@Module({
  imports: [
    AppConfigModule,
    KafkaModule.register('api-gateway-group'),
    GatewayAuthModule,
    GatewayEventsModule,
  ],

 
})
export class AppModule {}
