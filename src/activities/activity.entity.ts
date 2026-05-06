import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  CreateDateColumn, UpdateDateColumn, JoinColumn
} from 'typeorm';
import { Contact } from '../contacts/contact.entity';
import { Deal } from '../deals/deal.entity';
import { User } from '../users/user.entity';
import { Company } from '../companies/company.entity';

export enum ActivityType {
  CALL    = 'call',
  EMAIL   = 'email',
  MEETING = 'meeting',
  NOTE    = 'note',
  TASK    = 'task',
  DEMO    = 'demo',
}

export enum ActivityStatus {
  PLANNED   = 'planned',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ActivityType })
  type: ActivityType;

  @Column()
  subject: string;

  @Column({ type: 'text', nullable: true })
  body: string;

  @Column({ type: 'enum', enum: ActivityStatus, default: ActivityStatus.PLANNED })
  status: ActivityStatus;

  @Column({ type: 'timestamptz', nullable: true })
  scheduledAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt: Date;

  @Column({ type: 'int', nullable: true })
  duration: number;

  @Column({ type: 'boolean', default: false })
  isPinned: boolean;

  // ✅ No inverse callbacks — fixes all TS errors
  @ManyToOne(() => Contact, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  contact: Contact;

  @ManyToOne(() => Deal, deal => deal.activities, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  deal: Deal;

  @ManyToOne(() => Company, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  company: Company;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  createdBy: User;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}