// deals/deals.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deal } from './deal.entity';
import { dealsController } from './deals.controller';
import { dealsService } from './deals.service';
import { Company } from '../companies/company.entity'; // <--- لازم تضيفي السطر ده

@Module({
  // لازم تضيفي الـ Company هنا عشان الـ dealsService يقدر يستخدم الـ Repository بتاعها
  imports: [TypeOrmModule.forFeature([Deal, Company])], 
  controllers: [dealsController],
  providers: [dealsService],
  exports: [dealsService] // لو حابة تستخدمي الـ service ده في مكان تاني مستقبلاً
})
export class DealsModule {}