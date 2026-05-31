import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './roles.entity';
import { Permission } from './permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Permission]),
  ],
  controllers: [RolesController],
  providers: [RolesService],
  // 👈 هنا التعديل: لازم تخرجي الـ TypeOrmModule عشان الـ Repositories تبقى متاحة بره
  exports: [RolesService, TypeOrmModule], 
})
export class RolesModule {}