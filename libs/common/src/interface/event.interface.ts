export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
}

export enum TicketStatus {
  RESERVED = 'RESERVED',
  ACTIVE = 'ACTIVE',
  USED = 'USED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}
export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}
export enum RefundStatus {
  NONE = 'NONE',
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REFUNDED = 'REFUNDED',
}
export interface IEvent {
  id: string;
  title: string;
  capacity: number;
  description: string;
  category: string;
  date: Date;
  location: string;
  price: number;
  totalTickets: number;
  availableTickets: number;
  status: EventStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITicket {
  id: string;
  ticketNumber: string;
  eventId: string;
  userId: string;
  price: number;
  status: TicketStatus;
  createdAt: Date;
  updatedAt: Date;
}