import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './companies.service';
import { CreateCompanyDto } from './dtos/create.company.dto';
import { UpdateCompanyDto } from './dtos/update.company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 
import { PermissionsGuard } from '../auth/guards/roles.guard';
import { CheckPermissions } from '../auth/decorators/roles.decorator'; // استخدمي الديكوريتور الموحد بتاعك

@Controller('companies')
@UseGuards(JwtAuthGuard, PermissionsGuard) // حطيها فوق الكنترولر طالما كل الروتس محتاجة تأمين، ووحدي الترتيب
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @CheckPermissions('companies-create') // رقم 1 في جدول الـ role_permissions عندك!
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    return await this.companyService.create(createCompanyDto);
  }

  @Get(':id')
  @CheckPermissions('companies-read') // الصلاحية رقم 2 في جدول الـ role_permissions عندك
  async get(@Param('id') id: string) {
    return await this.companyService.get(id);
  }

  @Patch(':id')
  @CheckPermissions('companies-update') // شيكي في الـ DB غالبا هتكون رقم 3
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return await this.companyService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @CheckPermissions('companies-delete') // غالبا رقم 4
  async delete(@Param('id') id: string) {
    await this.companyService.delete(id);
    return { message: 'Company deleted successfully' };
  }
}