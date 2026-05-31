// contacts/contact.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
//                                                                      ^^^^^^^^^^ added
import { Company } from '../companies/company.entity';
import { Deal } from '../deals/deal.entity';

export enum ContactStatus {
  LEAD = 'lead',
  PROSPECT = 'prospect',
  CUSTOMER = 'customer',
  CHURNED = 'churned',
}

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;
// أضف هذا السطر داخل كلاس الـ Contact
  @Column({ nullable: true })
  jobTitle: string;
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: ContactStatus, default: ContactStatus.LEAD })
  status: ContactStatus;

  @ManyToOne(() => Company, company => company.contacts, { nullable: true , 
  onDelete: 'CASCADE'})
  company: Company;

  @OneToMany(() => Deal, deal => deal.contact)  // ✅ fixed typo
  deals: Deal[];

  @Column({ type: 'jsonb', nullable: true })
  customFields: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}