import { Module } from '@nestjs/common';
import { TicketServiceController } from './modules/ticket/ticket-service.controller';
import { TicketServiceService } from './modules/ticket/ticket-service.service';

@Module({
  imports: [],
  controllers: [TicketServiceController],
  providers: [TicketServiceService],
})
export class TicketServiceModule {}
