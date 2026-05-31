import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 1. استخراج التوكن من الـ Header كـ Bearer Token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // رفض التوكن لو منتهي الصلاحية
secretOrKey: process.env.JWT_SECRET!    });
  }

  /**
   * الميثود دي بتشتغل تلقائياً بعد ما يتم فك تشفير التوكن بنجاح
   * الـ payload هو الكائن اللي إحنا عملنا له sign في الـ AuthService
   */
  async validate(payload: any) {
    // أي حاجة بنرجعها هنا، NestJS بيحطها في الـ req.user
    return { 
      userId: payload.sub, 
      email: payload.email, 
      role: payload.role,
      // أهم سطر عشان الـ PermissionsGuard يشتغل:
      permissions: payload.permissions 
    };
  }
}