import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  JwtAuthGuard,
  Roles,
  RolesGuard,
  UserRole,
  CreateEventDto,
  CreateEventResponseDto,
  EventResponseDto,
  EventSearchDto,
  UpdateEventDto,
  GetEventsResponseDto,
} from '@app/common';
import { GatewayEventsService } from './events.service';

@ApiTags('Events')
@Controller('events')
export class GatewayEventsController {
  constructor(private readonly gatewayEventsService: GatewayEventsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.HOST, UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new event (Host/Admin only)' })
  @ApiResponse({ status: 201, description: 'Event created successfully', type: CreateEventResponseDto })
  createEvent(@Body() createEventDto: CreateEventDto, @Request() req: any) {
    const userId = req.user?.sub || req.user?.userId || req.user?.id;
    return this.gatewayEventsService.createEvent(createEventDto, userId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get list of events (Public)' })
  @ApiResponse({ status: 200, description: 'List of events', type: GetEventsResponseDto })
  getEvents(@Query() query?: EventSearchDto) {
    return this.gatewayEventsService.findAll(query);
  }

  @Get('my-events')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.HOST, UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get events created by the logged-in user' })
  @ApiResponse({ status: 200, description: 'List of events', type: GetEventsResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden: Insufficient permissions' })
  getMyEvents(@Request() req: any) {
    const userId = req.user?.sub || req.user?.userId || req.user?.id;
    return this.gatewayEventsService.findMyEvents(userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get event by ID (Public)' })
  @ApiResponse({ status: 200, description: 'Event details', type: EventResponseDto })
  @ApiResponse({ status: 404, description: 'Event not found' })
  getEvent(@Param('id') id: string) {
    return this.gatewayEventsService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.HOST, UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an event (Host/Admin only)' })
  @ApiResponse({ status: 200, description: 'Event updated successfully', type: EventResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden: Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  updateEvent(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto, @Request() req: any) {
    const userId = req.user?.sub || req.user?.userId || req.user?.id;
    return this.gatewayEventsService.updateEvent(id, updateEventDto, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.HOST, UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an event (Host/Admin only)' })
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden: Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  deleteEvent(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.sub || req.user?.userId || req.user?.id;
    return this.gatewayEventsService.deleteEvent(id, userId);
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.HOST, UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish an event (Host/Admin only)' })
  @ApiResponse({ status: 200, description: 'Event published successfully' })
  publishEvent(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.sub || req.user?.userId || req.user?.id;
    return this.gatewayEventsService.publishEvent(id, userId);
  }
}
