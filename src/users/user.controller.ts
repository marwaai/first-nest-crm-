import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Delete,
  Param, 
  UseInterceptors, 
  ClassSerializerInterceptor, 
  UnauthorizedException,
  HttpCode,
  HttpStatus,UseGuards
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dtos/signup.dto';
import { LoginDto } from '../auth/dtos/login.dtos';
import { SetMetadata } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 
import { RolesGuard } from '../auth/guards/roles.guard';
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor) // لإخفاء الباسورد عند الإرجاع
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 1. تسجيل مستخدم جديد
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }



  // 3. جلب بيانات مستخدم
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findById(id);
  }

// دي اللي بتخليكي تكتبي @Roles('admin') فوق أي فانكشن
@Delete(':id')
  @Roles('admin') // <--- هنا حددنا إن الصلاحية للأدمن بس
  @UseGuards(JwtAuthGuard, RolesGuard) // الـ RolesGuard هو اللي هيتأكد من الرول
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}