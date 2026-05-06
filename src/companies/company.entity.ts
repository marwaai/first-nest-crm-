import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Contact } from '../contacts/contact.entity';
import { Deal } from '../deals/deal.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  size: string; // small, medium, enterprise

  @Column({ nullable: true })
  country: string;

  @OneToMany(() => Contact, contact => contact.company,)
  contacts: Contact[];

  @OneToMany(() => Deal, deal => deal.company)  // ✅ added here
  deals: Deal[];

  @CreateDateColumn()
  createdAt: Date;
}