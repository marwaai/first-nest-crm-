import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { Contact } from '../contacts/contact.entity';
import { CompanyService } from './companies.service';
import { CompanyController } from './companies.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Contact])],
  controllers: [CompanyController],   // 🔥 REQUIRED
  providers: [CompanyService],        // 🔥 REQUIRED
})
export class CompaniesModule {}