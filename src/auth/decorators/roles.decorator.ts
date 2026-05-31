import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

// هذا هو الديكوريتور الذي تستخدمينه في الكنترولر كـ @CheckPermissions('...')
export const CheckPermissions = (...permissions: string[]) => 
  SetMetadata(PERMISSIONS_KEY, permissions);