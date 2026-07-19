import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: 'Tech Conference 2026', description: 'Title of the event' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ example: 'An annual gathering of tech innovators and developers.', description: 'Detailed description' })
  @IsNotEmpty()
  @IsString()
  description!: string;

  @ApiProperty({ example: 'Technology', description: 'Category of the event', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: '2026-12-01T10:00:00.000Z', description: 'Event date and time (ISO string)' })
  @IsNotEmpty()
  @IsDateString()
  date!: string;

  @ApiProperty({ example: 'Dhaka Convention Center', description: 'Physical location or online link' })
  @IsNotEmpty()
  @IsString()
  location!: string;

  @ApiProperty({ example: 499.99, description: 'Price per ticket (0 for free events)' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({ example: 500, description: 'Total number of tickets available' })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  totalTickets!: number;
}
