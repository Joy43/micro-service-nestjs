import { ApiProperty } from '@nestjs/swagger';
import { EventEntity, EventStatus } from '../entities/events.entities';

export class EventResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 'Tech Conference 2026' })
  title!: string;

  @ApiProperty({ example: 'An annual gathering of tech innovators and developers.' })
  description!: string;

  @ApiProperty({ example: 'Technology' })
  category!: string;

  @ApiProperty({ example: '2026-12-01T10:00:00.000Z' })
  date!: Date;

  @ApiProperty({ example: 'Dhaka Convention Center' })
  location!: string;

  @ApiProperty({ example: 499.99 })
  price!: number;

  @ApiProperty({ example: 500 })
  totalTickets!: number;

  @ApiProperty({ example: 500 })
  availableTickets!: number;

  @ApiProperty({ enum: EventStatus, example: EventStatus.PUBLISHED })
  status!: EventStatus;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  createdBy!: string;

  @ApiProperty({ example: '2026-07-19T10:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-07-19T10:00:00.000Z' })
  updatedAt!: Date;
}

export class CreateEventResponseDto {
  @ApiProperty({ type: EventResponseDto })
  event!: EventEntity;

  @ApiProperty({ example: 'Event created successfully' })
  message!: string;
}

export class GetEventsResponseDto {
  @ApiProperty({ type: [EventResponseDto] })
  events!: EventEntity[];

  @ApiProperty({ example: 50 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;
}
