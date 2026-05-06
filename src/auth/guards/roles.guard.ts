import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // بيقرأ الـ Roles اللي إنتي كاتباها فوق الـ Endpoint (مثلاً 'admin')
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // لو الـ Endpoint مش متحدد لها Role معين، سيب اليوزر يدخل عادي
    if (!requiredRoles) {
      return true;
    }

    // بيجيب اليوزر من الـ Request (اللي الـ JwtAuthGuard حطه هناك)
    const { user } = context.switchToHttp().getRequest();

    // بيتأكد: هل الرول بتاع اليوزر موجود ضمن الرولز المسموح لها؟
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}