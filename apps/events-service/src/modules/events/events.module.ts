import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { KafkaModule } from '@app/kafka';
import { HederaModule } from '@app/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventEntity } from './entities/events.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventEntity]),
    KafkaModule.register('events-service-group'),
    HederaModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') ?? 'fallback_secret',
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
