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
import { dealsService } from './deals.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('companies/:companyId/deals') // ربط الكونتكت بالشركة في الـ URL
@UseGuards(JwtAuthGuard) // حماية كل الـ Routes اللي هنا
export class dealsController {
  constructor(private readonly dealsService: dealsService) {}

  // 1. إضافة كونتكت جديد لشركة معينة
  @Post()
  async create(
    @Param('companyId') companyId: string, 
    @Body() CreateDealDto: any
  ) {
    return await this.dealsService.create(CreateDealDto, companyId);
  }

  // 2. جلب كل الكونتكتس لشركة معينة
  @Get()
  async findAll(@Param('companyId') companyId: string) {
    return await this.dealsService.findAllByCompany(companyId);
  }

  // 3. جلب كونتكت واحد محدد
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.dealsService.findOne(id);
  }

  // 4. تحديث بيانات كونتكت
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return await this.dealsService.update(id, updateData);
  }

  // 5. حذف كونتكت
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.dealsService.remove(id);
  }
}