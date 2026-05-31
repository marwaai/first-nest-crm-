// users/user.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany,
  ManyToOne, JoinColumn
} from 'typeorm';
import { Deal } from '../deals/deal.entity';
import { Activity } from '../activities/activity.entity';
import { Role } from '../roles/roles.entity'; // استيراد الـ Role Entity الجديد

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string; // TypeORM سيولدها تلقائياً

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false })       
  password!: string;

  @ManyToOne(() => Role, (role) => role.users, { 
    nullable: false, 
    onDelete: 'RESTRICT'
  })
  @JoinColumn({ name: 'role_id' })
  role!: Role; // أصلحنا الخطأ هنا

  @Column({ default: true })
  isActive!: boolean;

  @Column({ nullable: true })
  avatarUrl?: string; // استخدمنا ? لأنها nullable فعلياً

  @OneToMany(() => Deal, deal => deal.owner)
  deals!: Deal[]; // المصفوفات أيضاً تحتاج ! لضمان وجودها عند الـ Load


  @CreateDateColumn() 
  createdAt!: Date;

  @UpdateDateColumn() 
  updatedAt!: Date;
}