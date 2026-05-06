import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController], // تأكدي أن هذا السطر موجود
  providers: [UsersService],     // تأكدي أن هذا السطر موجود
  exports: [UsersService], 
})
export class UsersModule {}