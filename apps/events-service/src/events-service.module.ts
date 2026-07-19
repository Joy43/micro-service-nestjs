import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from '@app/common';
import { KafkaModule } from '@app/kafka';
import { EventsModule } from './modules/events/events.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule.register('events'),
    KafkaModule.register('events-service-group'),
    EventsModule,
  ],
  controllers: [],
  providers: [],
})
export class EventsServiceModule {}
