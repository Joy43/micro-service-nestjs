import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ITicket, PaymentStatus, RefundStatus, TicketStatus } from '@app/common';

export { TicketStatus };

@Entity('tickets')
export class TicketEntity implements ITicket {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  ticketNumber!: string;

  @Column({ unique: true, nullable: true })
  qrCode?: string;

  @Column({ type: 'text', nullable: true })
  bannerImage?: string;

  @Column({ type: 'text', nullable: true })
  thumbnail?: string;

  @Column({ type: 'uuid', name: 'event_id' })
  eventId!: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @Column({ type: 'uuid', name: 'ticket_type_id', nullable: true })
  ticketTypeId?: string;

  @Column({ type: 'uuid', name: 'order_id', nullable: true })
  orderId?: string;

  @Column({ type: 'uuid', name: 'attendee_id', nullable: true })
  attendeeId?: string;

  @Column({ type: 'int', default: 1 })
  capacity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  basePrice!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  taxAmount!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  serviceFee!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount!: number;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.ACTIVE,
  })
  status!: TicketStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PAID,
  })
  paymentStatus!: PaymentStatus;

  @Column({
    type: 'enum',
    enum: RefundStatus,
    default: RefundStatus.NONE,
  })
  refundStatus!: RefundStatus;

  @Column({ nullable: true })
  section?: string;

  @Column({ nullable: true })
  row?: string;

  @Column({ nullable: true })
  seatNumber?: string;

  @Column({ nullable: true })
  checkedInAt?: Date;

  @Column({ nullable: true })
  checkedInBy?: string;

  @Column({ nullable: true })
  transferredToUserId?: string;

  @Column({ nullable: true })
  refundedAt?: Date;

  @Column({ nullable: true })
  createdBy?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}