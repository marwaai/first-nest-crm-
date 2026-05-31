import { 
  Injectable, 
  CanActivate, 
  ExecutionContext, 
  ForbiddenException 
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/roles.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. استخراج الصلاحيات المطلوبة من الديكوريتور (Metadata)
    // نستخدم getAllAndOverride للبحث في الميثود أولاً ثم الكلاس
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. إذا لم يكن هناك صلاحيات محددة، اسمح بالوصول (مسار عام للمسجلين فقط)
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // 3. الحصول على بيانات المستخدم من الطلب (Request)
    // ملاحظة: الـ JwtAuthGuard يجب أن يعمل قبل هذا الجارد ليملأ req.user
    const { user } = context.switchToHttp().getRequest();
if (user.role=="admin"){
  return true
}
    if (!user || !user.permissions) {
      throw new ForbiddenException('لا تملك الصلاحيات الكافية للوصول لهذا المسار');
    }

    // 4. التحقق: هل المستخدم يمتلك "كل" الصلاحيات المطلوبة لهذا المسار؟
    const hasAllPermissions = requiredPermissions.every((permission) =>
      user.permissions.includes(permission),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException('عذراً، دورك الوظيفي الحالي لا يسمح لك بهذا الإجراء');
    }

    return true;
  }
}