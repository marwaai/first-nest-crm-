import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request, // ضيفيها لو محتاجة بيانات اليوزر
} from '@nestjs/common';
import { CompanyService } from './companies.service';
import { CreateCompanyDto } from './dtos/create.company.dto';
import { UpdateCompanyDto } from './dtos/update.company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 
import { RolesGuard } from '../auth/guards/roles.guard';
import { SetMetadata } from '@nestjs/common';

// يُفضل تحطي الـ Roles Decorator في ملف لوحده بس لو هنا شغال عادي
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Controller('companies') // <--- لازم تضيفي دي عشان يحدد الـ Base Path
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @Roles('admin',"manager") 
  @UseGuards(JwtAuthGuard, RolesGuard) // الترتيب مهم: يتأكد إنه داخل (JWT) ثم يشوف صلاحياته (Roles)
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    return await this.companyService.create(createCompanyDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard) // لو عايزة أي حد معاه Token بس يشوف الشركة
  async get(@Param('id') id: string) {
    return await this.companyService.get(id);
  }

  @Patch(':id')
  @Roles('admin', 'manager') // ممكن تسمحي لأكثر من صلاحية بالتعديل
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return await this.companyService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @Roles('admin',"manager") // الحذف للأدمن فقط
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(@Param('id') id: string) {
    await this.companyService.delete(id);
    return { message: 'Company deleted successfully' };
  }
}