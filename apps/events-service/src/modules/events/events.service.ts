import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { KAFKA_SERVICE, KAFKA_TOPICS } from '@app/kafka';
import { EventEntity, EventStatus } from './entities/events.entities';
import { CreateEventDto, EventSearchDto, UpdateEventDto } from './dto/index';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    @Inject(KAFKA_SERVICE)
    private readonly kafkaClient: ClientKafka,
  ) {}

  // -------create events------
  async createEvent(createEventDto: CreateEventDto, userId: string) {
    const newEvent = this.eventRepository.create({
      ...createEventDto,
      date: new Date(createEventDto.date),
      availableTickets: createEventDto.totalTickets,
      status: EventStatus.DRAFT,
      createdBy: userId,
    });

    const savedEvent = await this.eventRepository.save(newEvent);

    // Emit Kafka event
    this.kafkaClient.emit(KAFKA_TOPICS.EVENT_CREATED, {
      eventId: savedEvent.id,
      title: savedEvent.title,
      date: savedEvent.date,
      location: savedEvent.location,
      price: savedEvent.price,
      totalTickets: savedEvent.totalTickets,
      createdBy: userId,
      timestamp: new Date().toISOString(),
    });

    return {
      event: savedEvent,
      message: 'Event created successfully',
    };
  }

  async findAll(queryDto?: EventSearchDto) {
    const page = queryDto?.page || 1;
    const limit = queryDto?.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.eventRepository.createQueryBuilder('event');

    // If query text is provided, search title or description
    if (queryDto?.query) {
      queryBuilder.andWhere(
        '(LOWER(event.title) LIKE LOWER(:query) OR LOWER(event.description) LIKE LOWER(:query))',
        { query: `%${queryDto.query}%` },
      );
    }

    if (queryDto?.category) {
      queryBuilder.andWhere('LOWER(event.category) = LOWER(:category)', {
        category: queryDto.category,
      });
    }

    if (queryDto?.location) {
      queryBuilder.andWhere('LOWER(event.location) LIKE LOWER(:location)', {
        location: `%${queryDto.location}%`,
      });
    }

    if (queryDto?.status) {
      queryBuilder.andWhere('event.status = :status', { status: queryDto.status });
    } else {
      // Default to showing only PUBLISHED events for public listing if no specific status requested
      queryBuilder.andWhere('event.status = :status', { status: EventStatus.PUBLISHED });
    }

    queryBuilder.orderBy('event.date', 'ASC').skip(skip).take(limit);

    const [events, total] = await queryBuilder.getManyAndCount();

    return {
      events,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<EventEntity> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }
    return event;
  }

  async updateEvent(id: string, updateEventDto: UpdateEventDto, userId: string) {
    const event = await this.findOne(id);

    if (event.createdBy !== userId) {
      throw new ForbiddenException('You do not have permission to update this event');
    }

    if (updateEventDto.date) {
      event.date = new Date(updateEventDto.date);
    }
    if (updateEventDto.totalTickets !== undefined) {
      const difference = updateEventDto.totalTickets - event.totalTickets;
      event.totalTickets = updateEventDto.totalTickets;
      event.availableTickets = Math.max(0, event.availableTickets + difference);
    }

    Object.assign(event, {
      ...updateEventDto,
      date: event.date,
      totalTickets: event.totalTickets,
    });

    const updatedEvent = await this.eventRepository.save(event);

    this.kafkaClient.emit(KAFKA_TOPICS.EVENT_UPDATED, {
      eventId: updatedEvent.id,
      title: updatedEvent.title,
      date: updatedEvent.date,
      location: updatedEvent.location,
      price: updatedEvent.price,
      status: updatedEvent.status,
      updatedBy: userId,
      timestamp: new Date().toISOString(),
    });

    return updatedEvent;
  }

  async deleteEvent(id: string, userId: string) {
    const event = await this.findOne(id);

    if (event.createdBy !== userId) {
      throw new ForbiddenException('You do not have permission to delete this event');
    }

    await this.eventRepository.remove(event);

    this.kafkaClient.emit(KAFKA_TOPICS.EVENT_DELETED, {
      eventId: id,
      deletedBy: userId,
      timestamp: new Date().toISOString(),
    });

    return { message: 'Event deleted successfully' };
  }

  async publishEvent(id: string, userId: string) {
    const event = await this.findOne(id);

    if (event.createdBy !== userId) {
      throw new ForbiddenException('You do not have permission to publish this event');
    }

    event.status = EventStatus.PUBLISHED;
    const publishedEvent = await this.eventRepository.save(event);

    this.kafkaClient.emit(KAFKA_TOPICS.EVENT_PUBLISHED, {
      eventId: publishedEvent.id,
      title: publishedEvent.title,
      date: publishedEvent.date,
      location: publishedEvent.location,
      price: publishedEvent.price,
      publishedBy: userId,
      timestamp: new Date().toISOString(),
    });

    return {
      event: publishedEvent,
      message: 'Event published successfully',
    };
  }

  async findMyEvents(userId: string) {
    const events = await this.eventRepository.find({
      where: { createdBy: userId },
      order: { createdAt: 'DESC' },
    });

    return {
      events,
      total: events.length,
      page: 1,
      limit: events.length,
    };
  }
}
