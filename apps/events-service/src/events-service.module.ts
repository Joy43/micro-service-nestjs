import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from '@app/common';
import { EventsModule } from './modules/events/events.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule.register('events'),
    EventsModule,
  ],
})
export class EventsServiceModule {}
