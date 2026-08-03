import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards, Request } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateEventDto,
  CreateEventResponseDto,
  EventResponseDto,
  EventSearchDto,
  GetEventsResponseDto,
  HederaMirrorService,
  HederaService,
  JwtAuthGuard,
  Roles,
  RolesGuard,
  UpdateEventDto,
  UserRole,
} from '@app/common';
import { EventsService } from './events.service';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService,
    private readonly hederaService: HederaService,
    private readonly hederaMirrorService: HederaMirrorService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.HOST, UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new event (Host/Admin only)' })
  createEvent(@Body() createEventDto: CreateEventDto, @Request() req: any) {
    const userId = req.user?.sub || req.user?.userId || req.user?.id;
    return this.eventsService.createEvent(createEventDto, userId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get list of events (Public)' })
  getEvents(@Query() query?: EventSearchDto) {
    return this.eventsService.findAll(query);
  }

  @Get('hedera/test-topic')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Test Hedera: Create a topic and submit a test message' })
  async testHedera() {
    const topicId = await this.hederaService.createTopic();
    const submitResult = await this.hederaService.submitTextMessage(
      topicId,
      JSON.stringify({ test: 'Hedera integration test', timestamp: new Date().toISOString() }),
    );
    return {
      topicId,
      submitResult,
      mirrorNodeUrl: `https://testnet.mirrornode.hedera.com/api/v1/topics/${topicId}/messages`,
      hashscanUrl: `https://hashscan.io/testnet/topic/${topicId}`,
    };
  }

  @Get('hedera/messages/:topicId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Test Hedera Mirror Node: Fetch topic messages' })
  async getTopicMessages(@Param('topicId') topicId: string) {
    return this.hederaMirrorService.getTopicMessages(topicId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get event by ID (Public)' })
  @ApiResponse({ status: 200, description: 'Event details', type: EventResponseDto })
  @ApiResponse({ status: 404, description: 'Event not found' })
  getEvent(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.HOST, UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an event (Host/Admin only)' })
  updateEvent(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto, @Request() req: any) {
    const userId = req.user?.sub || req.user?.userId || req.user?.id;
    return this.eventsService.updateEvent(id, updateEventDto, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.HOST, UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an event (Host/Admin only)' })
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })
  deleteEvent(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.sub || req.user?.userId || req.user?.id;
    return this.eventsService.deleteEvent(id, userId);
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.HOST, UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish an event (Host/Admin only)' })
  publishEvent(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.sub || req.user?.userId || req.user?.id;
    return this.eventsService.publishEvent(id, userId);
  }

  @Get('my-events')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.HOST, UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get events created by the logged-in user' })

  getMyEvents(@Request() req: any) {
    const userId = req.user?.sub || req.user?.userId || req.user?.id;
    return this.eventsService.findMyEvents(userId);
  }

  // --- MICROSERVICE MESSAGE PATTERNS (For internal communication) ---
  
  @MessagePattern('events.create')
  async handleCreateEvent(@Payload() data: { eventData: CreateEventDto; userId: string }) {
    return this.eventsService.createEvent(data.eventData, data.userId);
  }

  @MessagePattern('events.findAll')
  async handleFindAllEvents(@Payload() query?: EventSearchDto) {
    return this.eventsService.findAll(query);
  }

  @MessagePattern('events.findOne')
  async handleFindOneEvent(@Payload() id: string) {
    return this.eventsService.findOne(id);
  }

  @MessagePattern('events.update')
  async handleUpdateEvent(@Payload() data: { id: string; updateData: UpdateEventDto; userId: string }) {
    return this.eventsService.updateEvent(data.id, data.updateData, data.userId);
  }

  @MessagePattern('events.delete')
  async handleDeleteEvent(@Payload() data: { id: string; userId: string }) {
    return this.eventsService.deleteEvent(data.id, data.userId);
  }

  @MessagePattern('events.publish')
  async handlePublishEvent(@Payload() data: { id: string; userId: string }) {
    return this.eventsService.publishEvent(data.id, data.userId);
  }

  @MessagePattern('events.my-events')
  async handleFindMyEvents(@Payload() userId: string) {
    return this.eventsService.findMyEvents(userId);
  }
}