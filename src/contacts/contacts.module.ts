// contacts/contacts.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './contact.entity';
import { ContactsService } from './contact.service';
import { ContactsController } from './contact.controller';
import { Company } from '../companies/company.entity'; // <--- لازم تضيفي السطر ده
@Module({
  imports: [TypeOrmModule.forFeature([Contact, Company])],
  controllers: [ContactsController],
  providers: [ContactsService],
})
export class ContactsModule {}