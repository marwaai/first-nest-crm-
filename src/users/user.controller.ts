import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Request,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dtos/signup.dto';
import { UpdateUserDto } from './dtos/user.update';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/roles.guard';
import { CheckPermissions } from '../auth/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * تسجيل مستخدم جديد (Sign Up)
   * مفتوحة للعامة - لا تحتاج Token أو صلاحيات
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * جلب بيانات البروفايل لليوزر الحالي
   * تحتاج Token فقط (بدون برمشن محدد)
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard) // شلنا الـ PermissionsGuard هنا عشان البروفايل مش محتاج صلاحية معينة، محتاج يوزر مسجل بس
  getProfile(@Request() req) {
    return this.usersService.findById(req.user.userId);
  }

  /**
   * جلب مستخدم محدد بالـ ID
   * الصلاحية المطلوبة: USER_VIEW_SINGLE
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard) // حماية! عشان الـ CheckPermissions تشتغل صح
  @CheckPermissions('USER_VIEW_SINGLE')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id);
  }

  /**
   * تحديث بيانات مستخدم
   * الصلاحية المطلوبة: USER_UPDATE
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard) // حماية! عشان الـ CheckPermissions تشتغل صح
  @CheckPermissions('USER_UPDATE')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * حذف مستخدم نهائياً من النظام
   * الصلاحية المطلوبة: USER_DELETE
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard) // الترتيب الصحيح بدون أسطر فارغة
  @CheckPermissions('USER_DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}