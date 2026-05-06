import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from '../contacts/contact.entity';
import { Company } from '../companies/company.entity';
import {UpdateContactDto} from "./dto/update.contact.dto"
@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  // 1. إنشاء Contact جديد (إلزامي وجود Company)
// 1. إنشاء Contact جديد
  async create(createContactDto: any, companyId: string): Promise<Contact> {
    const company = await this.companyRepository.findOne({ where: { id: companyId } });
    
    if (!company) {
      throw new NotFoundException(`الشركة غير موجودة`);
    }

    const contactInstance = this.contactRepository.create({
      ...createContactDto,
      company: company, 
    });

    // إضافة 'as Contact' تخبر المترجم أننا ننتظر كائناً واحداً فقط
return (await this.contactRepository.save(contactInstance)) as unknown as Contact;
  }

  // 2. جلب كل جهات الاتصال الخاصة بشركة معينة
  async findAllByCompany(companyId: string): Promise<Contact[]> {
    return await this.contactRepository.find({
      where: { company: { id: companyId } },
      order: { createdAt: 'DESC' },
    });
  }

  // 3. جلب تفاصيل Contact واحد
  async findOne(id: string): Promise<Contact> {
    const contact = await this.contactRepository.findOne({
      where: { id },
      relations: ['company'], // لجلب بيانات الشركة التابع لها
    });

    if (!contact) {
      throw new NotFoundException(`جهة الاتصال غير موجودة`);
    }

    return contact;
  }

  // 4. تحديث بيانات Contact
  async update(id: string, updateData: UpdateContactDto): Promise<Contact> {
    await this.contactRepository.update(id, updateData);
    return this.findOne(id);
  }

  // 5. حذف Contact
  async remove(id: string): Promise<void> {
    const result = await this.contactRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`لا يمكن الحذف، جهة الاتصال غير موجودة`);
    }
  }
}