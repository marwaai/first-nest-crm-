import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deal } from '../deals/deal.entity';
import { Company } from '../companies/company.entity';

@Injectable()
export class dealsService {
  constructor(
    @InjectRepository(Deal)
    private readonly dealsRepository: Repository<Deal>,
    
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  // 1. إنشاء Contact جديد (إلزامي وجود Company)
// 1. إنشاء Contact جديد
  async create(CreateDealDto: any, companyId: string): Promise<Deal> {
    const company = await this.companyRepository.findOne({ where: { id: companyId } });
    
    if (!company) {
      throw new NotFoundException(`الشركة غير موجودة`);
    }

    const dealsInstance = this.dealsRepository.create({
      ...CreateDealDto,
      company: company, 
    });

    // إضافة 'as Contact' تخبر المترجم أننا ننتظر كائناً واحداً فقط
return (await this.dealsRepository.save(dealsInstance)) as unknown as Deal;
  }

  // 2. جلب كل جهات الاتصال الخاصة بشركة معينة
  async findAllByCompany(companyId: string): Promise<Deal[]> {
    return await this.dealsRepository.find({
      where: { company: { id: companyId } },
      order: { createdAt: 'DESC' },
    });
  }

  // 3. جلب تفاصيل Contact واحد
  async findOne(id: string): Promise<Deal> {
    const deals = await this.dealsRepository.findOne({
      where: { id },
      relations: ['company'], // لجلب بيانات الشركة التابع لها
    });

    if (!deals) {
      throw new NotFoundException(`جهة الاتصال غير موجودة`);
    }

    return deals;
  }

  // 4. تحديث بيانات Contact
  async update(id: string, updateData: any): Promise<Deal> {
    await this.dealsRepository.update(id, updateData);
    return this.findOne(id);
  }

  // 5. حذف Contact
  async remove(id: string): Promise<void> {
    const result = await this.dealsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`لا يمكن الحذف، جهة الاتصال غير موجودة`);
    }
  }
}