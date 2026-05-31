import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * الخطوة الأولى: التحقق من صحة المستخدم
   */
  async validateUser(email: string, pass: string): Promise<any> {
    // هنا بننادي على الميثود اللي فيها QueryBuilder والـ Joins
    const user = await this.usersService.validateUser(email, pass);
    
    if (user) {
      return user;
    }
    return null;
  }

  /**
   * الخطوة الثانية: تسجيل الدخول وتوليد التوكن
   */
  async login(loginDto: any) {
    // 1. التأكد من وجود اليوزر وصحة الباسورد
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    // 2. تجهيز الـ Payload (المعلومات اللي هتمشي في التوكن)
    // لاحظي هنا بنسحب الـ Slugs بتاعة الـ Permissions عشان الجارد يقرأها
    const payload = { 
      sub: user.id, 
      email: user.email,
      role: user.role?.name,
      // تحويل مصفوفة الـ Permissions لأسماء نصية (Slugs) فقط
      permissions: user.role?.permissions?.map(p => p.slug) || [] 
    };

    // 3. توقيع التوكن وإرجاع البيانات
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role?.name,      permissions: user.role?.permissions?.map(p => p.slug) || [] 

      },
    };
  }
}