export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
}

export interface IEvent {
  id: string;
  title: string;
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
