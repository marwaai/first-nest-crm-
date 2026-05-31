// roles/entities/permission.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  action!: string; // مثلاً: 'clients_create'

  @Column({ nullable: true })
  label!: string; // اسم يظهر للمانجر: "إضافة عملاء"
  @Column({ unique: true })
slug!: string;
}