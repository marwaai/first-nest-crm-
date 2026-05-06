import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Patch, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { ContactsService } from './contact.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('companies/:companyId/contacts') // ربط الكونتكت بالشركة في الـ URL
@UseGuards(JwtAuthGuard) // حماية كل الـ Routes اللي هنا
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  // 1. إضافة كونتكت جديد لشركة معينة
  @Post()
  async create(
    @Param('companyId') companyId: string, 
    @Body() createContactDto: any
  ) {
    return await this.contactsService.create(createContactDto, companyId);
  }

  // 2. جلب كل الكونتكتس لشركة معينة
  @Get()
  async findAll(@Param('companyId') companyId: string) {
    return await this.contactsService.findAllByCompany(companyId);
  }

  // 3. جلب كونتكت واحد محدد
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.contactsService.findOne(id);
  }

  // 4. تحديث بيانات كونتكت
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return await this.contactsService.update(id, updateData);
  }

  // 5. حذف كونتكت
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.contactsService.remove(id);
  }
}