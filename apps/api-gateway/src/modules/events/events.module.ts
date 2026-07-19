import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { KafkaModule } from '@app/kafka';
import { GatewayEventsController } from './events.controller';
import { GatewayEventsService } from './events.service';

@Module({
  imports: [
    KafkaModule.register('api-gateway-events-client'),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') ?? 'fallback_secret',
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [GatewayEventsController],
  providers: [GatewayEventsService],
  exports: [GatewayEventsService],
})
export class GatewayEventsModule {}
