import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EventStatus, IEvent } from '@app/common';

export { EventStatus };

@Entity('events')
export class EventEntity implements IEvent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'varchar', length: 100, default: 'General' })
  category!: string;

  @Column({ type: 'timestamp' })
  date!: Date;

  @Column({ type: 'varchar', length: 255 })
  location!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price!: number;

  @Column({ type: 'int', name: 'total_tickets', default: 100 })
  totalTickets!: number;

  @Column({ type: 'int', name: 'available_tickets', default: 100 })
  availableTickets!: number;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.DRAFT,
  })
  status!: EventStatus;

  @Column({ type: 'uuid', name: 'created_by' })
  createdBy!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
