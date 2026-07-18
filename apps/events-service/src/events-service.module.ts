import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from '@app/common';
import { KafkaModule } from '@app/kafka';
import { EventsServiceController } from './events-service.controller';
import { EventsServiceService } from './events-service.service';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule.register('events'),
    KafkaModule.register('events-service-group'),
  ],
  controllers: [EventsServiceController],
  providers: [EventsServiceService],
})
export class EventsServiceModule {}
