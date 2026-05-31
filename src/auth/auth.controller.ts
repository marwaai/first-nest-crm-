import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus, 
  UnauthorizedException 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * مسار تسجيل الدخول (Login)
   * يرجع الـ Access Token الذي يحتوي على الصلاحيات الديناميكية
   */
  @Post('login')
  @HttpCode(HttpStatus.OK) // لإرجاع كود 200 بدلاً من 201 (الافتراضي للـ POST)
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    
    if (!result) {
      throw new UnauthorizedException('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
    
    return result;
  }

 
}