import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { KafkaModule } from '@app/kafka';
import { GatewayAuthController } from './auth.controller';
import { GatewayAuthService } from './auth.service';

@Module({
  imports: [
    KafkaModule.register('api-gateway-auth-client'),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') ?? 'fallback_secret',
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [GatewayAuthController],
  providers: [GatewayAuthService],
  exports: [GatewayAuthService],
})
export class GatewayAuthModule {}
