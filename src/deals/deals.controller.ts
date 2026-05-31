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
import { dealsService } from './deals.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/roles.guard'; // تأكد من استيراد الجارد الخاص بالصلاحيات إذا كان منفصلاً
import { CheckPermissions } from '../auth/decorators/roles.decorator';

@Controller('companies/:companyId/deals') // ربط الصفقة بالشركة في الـ URL
@UseGuards(JwtAuthGuard, PermissionsGuard) // حماية المسارات بالتحقق من الهوية والصلاحيات معاً
export class dealsController {
  constructor(private readonly dealsService: dealsService) {}

  // 1. إضافة صفقة جديدة لشركة معينة
  @Post()
  @CheckPermissions('deals-create') // التحقق من صلاحية الإضافة
  async create(
    @Param('companyId') companyId: string, 
    @Body() CreateDealDto: any
  ) {
    return await this.dealsService.create(CreateDealDto, companyId);
  }

  // 2. جلب كل الصفقات لشركة معينة
  @Get()
  @CheckPermissions('deals-read') // التحقق من صلاحية القراءة
  async findAll(@Param('companyId') companyId: string) {
    return await this.dealsService.findAllByCompany(companyId);
  }

  // 3. جلب صفقة واحدة محددة
  @Get(':id')
  @CheckPermissions('deals-read') // التحقق من صلاحية القراءة
  async findOne(@Param('id') id: string) {
    return await this.dealsService.findOne(id);
  }

  // 4. تحديث بيانات صفقة
  @Patch(':id')
  @CheckPermissions('deals-update') // التحقق من صلاحية التعديل
  async update(@Param('id') id: string, @Body() updateData: any) {
    return await this.dealsService.update(id, updateData);
  }

  // 5. حذف صفقة
  @Delete(':id')
  @CheckPermissions('deals-delete') // التحقق من صلاحية الحذف
  async remove(@Param('id') id: string) {
    return await this.dealsService.remove(id);
  }
}