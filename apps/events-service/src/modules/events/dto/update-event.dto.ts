import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateEventDto } from './create-event.dto';
import { EventStatus } from '../entities/events.entities';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @ApiProperty({ enum: EventStatus, example: EventStatus.PUBLISHED, description: 'Status of the event', required: false })
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}
