import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KAFKA_SERVICE } from '@app/kafka';
import { firstValueFrom } from 'rxjs';
import { CreateEventDto, UpdateEventDto, EventSearchDto } from '@app/common';

@Injectable()
export class GatewayEventsService implements OnModuleInit {
  constructor(@Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka) {}

  async onModuleInit() {
    const patterns = [
      'events.create',
      'events.findAll',
      'events.findOne',
      'events.update',
      'events.delete',
      'events.publish',
      'events.my-events',
    ];
    patterns.forEach((pattern) => this.kafkaClient.subscribeToResponseOf(pattern));
    await this.kafkaClient.connect();
  }

  async createEvent(eventData: CreateEventDto, userId: string) {
    return firstValueFrom(
      this.kafkaClient.send('events.create', { eventData, userId }),
    );
  }

  async findAll(query?: EventSearchDto) {
    return firstValueFrom(
      this.kafkaClient.send('events.findAll', query || {}),
    );
  }

  async findOne(id: string) {
    return firstValueFrom(
      this.kafkaClient.send('events.findOne', id),
    );
  }

  async updateEvent(id: string, updateData: UpdateEventDto, userId: string) {
    return firstValueFrom(
      this.kafkaClient.send('events.update', { id, updateData, userId }),
    );
  }

  async deleteEvent(id: string, userId: string) {
    return firstValueFrom(
      this.kafkaClient.send('events.delete', { id, userId }),
    );
  }

  async publishEvent(id: string, userId: string) {
    return firstValueFrom(
      this.kafkaClient.send('events.publish', { id, userId }),
    );
  }

  async findMyEvents(userId: string) {
    return firstValueFrom(
      this.kafkaClient.send('events.my-events', userId),
    );
  }
}
