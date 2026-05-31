// src/database/seed/seed.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Permission } from '../../roles/permission.entity';
import { RolesModule } from '../../roles/roles.module'; // 👈 استوردي الموديول ده
import { UsersModule } from '../../users/users.module';   // 👈 واستوردي الموديول ده
import { User } from '../../users/user.entity';
import { Role } from '../../roles/roles.entity';

@Module({
  imports: [
    // بنسيب الـ Permission للـ Feature، وبندخل الموديولات التانية عشان تفك الـ Circular Dependency
    TypeOrmModule.forFeature([Permission, Role, User]), 
    RolesModule, // 👈 ضيفيه هنا
    UsersModule, // 👈 ضيفيه هنا
  ],
  providers: [SeedService],
})
export class SeedModule {}