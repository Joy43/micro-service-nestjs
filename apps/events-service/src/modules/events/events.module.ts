import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaModule } from '@app/kafka';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventEntity } from './entities/events.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventEntity]),
    KafkaModule.register('events-service-group'),
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
