import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Patch, 
  UseGuards, 
} from '@nestjs/common';
import { ContactsService } from './contact.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/roles.guard'; // جارد التحقق من الصلاحيات
import { CheckPermissions } from '../auth/decorators/roles.decorator';

@Controller('companies/:companyId/contacts') // ربط الكونتكت بالشركة في الـ URL
@UseGuards(JwtAuthGuard, PermissionsGuard) // حماية المسارات بالتحقق من الـ Token والصلاحيات معاً
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  // 1. إضافة كونتكت جديد لشركة معينة
  @Post()
  @CheckPermissions('contacts-create') // صلاحية إضافة جهة اتصال
  async create(
    @Param('companyId') companyId: string, 
    @Body() createContactDto: any
  ) {
    return await this.contactsService.create(createContactDto, companyId);
  }

  // 2. جلب كل الكونتكتس لشركة معينة
  @Get()
  @CheckPermissions('contacts-read') // صلاحية عرض جهات الاتصال
  async findAll(@Param('companyId') companyId: string) {
    return await this.contactsService.findAllByCompany(companyId);
  }

  // 3. جلب كونتكت واحد محدد
  @Get(':id')
  @CheckPermissions('contacts-read') // صلاحية عرض جهة اتصال محددة
  async findOne(@Param('id') id: string) {
    return await this.contactsService.findOne(id);
  }

  // 4. تحديث بيانات كونتكت
  @Patch(':id')
  @CheckPermissions('contacts-update') // صلاحية تعديل جهة اتصال
  async update(@Param('id') id: string, @Body() updateData: any) {
    return await this.contactsService.update(id, updateData);
  }

  // 5. حذف كونتكت
  @Delete(':id')
  @CheckPermissions('contacts-delete') // صلاحية حذف جهة اتصال
  async remove(@Param('id') id: string) {
    return await this.contactsService.remove(id);
  }
}