import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { RolesModule } from '../roles/roles.module'; // استيراد موديول الرولز

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RolesModule, // 👈 دي الخطوة اللي ناقصة عشان الـ UsersService يقدر يستخدم الـ RoleRepository
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}