// deals/deal.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn
} from 'typeorm';
import { Contact } from '../contacts/contact.entity';
import { Company } from '../companies/company.entity';
import { User } from '../users/user.entity';
import { Activity } from '../activities/activity.entity';

export enum DealStage {
  NEW          = 'new',
  QUALIFIED    = 'qualified',
  PROPOSAL     = 'proposal',
  NEGOTIATION  = 'negotiation',
  CLOSED_WON   = 'closed_won',
  CLOSED_LOST  = 'closed_lost',
}

export enum DealPriority {
  LOW    = 'low',
  MEDIUM = 'medium',
  HIGH   = 'high',
}

@Entity('deals')
export class Deal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  value: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ type: 'enum', enum: DealStage, default: DealStage.NEW })
  stage: DealStage;

  @Column({ type: 'enum', enum: DealPriority, default: DealPriority.MEDIUM })
  priority: DealPriority;

  @Column({ type: 'int', default: 0 })   // 0–100
  probability: number;

  @Column({ type: 'date', nullable: true })
  expectedCloseDate: Date;

  @Column({ type: 'date', nullable: true })
  actualCloseDate: Date;

  @Column({ type: 'text', nullable: true })
  lostReason: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'jsonb', nullable: true })
  customFields: Record<string, any>;

  @ManyToOne(() => Contact, contact => contact.deals, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  contact: Contact;

  @ManyToOne(() => Company, company => company.deals, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  company: Company;

  @ManyToOne(() => User, user => user.deals, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  owner: User;

  @OneToMany(() => Activity, activity => activity.deal)
  activities: Activity[];

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}