import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 1. بيقول للبرنامج: روح هات التوكن من الـ Header اللي اسمه Authorization (Bearer Token)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      
      // 2. لو التوكن وقته خلص (Expired)، ارفضه فوراً
      ignoreExpiration: false,
      
      // 3. السر العظيم: لازم يكون نفس الـ Secret اللي استخدمتيه في الـ Login
      secretOrKey: process.env.JWT_SECRET as string,
    });
  }

  // 4. الفانكشن دي بتتنفذ "تلقائياً" لو التوكن طلع سليم
  async validate(payload: any) {
    // الـ payload هو البيانات اللي إنتي شفرتيها (زي id و role)
    // اللي بيرجع هنا بيتحط أوتوماتيك في الـ Request Object (req.user)
    return { 
      userId: payload.sub, 
      username: payload.username, 
      role: payload.role // مهم جداً عشان الـ RolesGuard يعرف يقرأ الـ role
    };
  }
}