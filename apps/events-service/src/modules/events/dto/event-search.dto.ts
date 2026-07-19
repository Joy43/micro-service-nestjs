import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { EventStatus } from '../entities/events.entities';

export class EventSearchDto {
  @ApiProperty({ example: 'Tech', description: 'Search term for title or description', required: false })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiProperty({ example: 'Technology', description: 'Filter by category', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: 'Dhaka', description: 'Filter by location', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ enum: EventStatus, example: EventStatus.PUBLISHED, description: 'Filter by event status', required: false })
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @ApiProperty({ example: 1, description: 'Page number', required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ example: 10, description: 'Items per page', required: false, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
