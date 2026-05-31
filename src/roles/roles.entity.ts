import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Permission } from './permission.entity';
import { User } from '../users/user.entity';

@Entity('roles')
@Unique(['name']) 
export class Role {
  @PrimaryGeneratedColumn()
  id!: number; // استخدام ! لحل خطأ "no initializer"

  @Column()
  name!: string; // الاسم الذي يدخله الأدمن (مثل: "مدير مبيعات")

  @Column({ nullable: true })
  description?: string; // جعلناها اختيارية باستخدام ? لتتوافق مع nullable: true

  @ManyToMany(() => Permission, { cascade: true })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions!: Permission[]; 

  @OneToMany(() => User, (user) => user.role)
  users!: User[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}