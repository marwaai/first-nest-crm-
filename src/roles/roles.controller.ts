import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  ParseIntPipe, UseGuards ,Req
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dtos/create.role.dto';
import { UpdateRoleDto } from './dtos/update.role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/roles.guard';
import { CheckPermissions } from '../auth/decorators/roles.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard) // الـ PermissionsGuard هنا هو اللي فيه "مفتاح" الأدمن
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  // الأدمن هيعدي أوتوماتيك، والمدير (Manager) مثلاً لازم يكون معاه الصلاحية دي
  @CheckPermissions('create_roles') 
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @CheckPermissions('view_roles') // حتى لو يوزر عادي بس مسموح له يشوف الأدوار
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @CheckPermissions('view_roles')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(id);
  }

 @Patch(':id')
@CheckPermissions('manage_roles')
update(
  @Param('id', ParseIntPipe) id: number, 
  @Body() updateRoleDto: UpdateRoleDto,
  @Req() req: any // 👈 استقبلي الـ Request كامل
) {
  // هنا بنمرر الـ user اللي متخزن في الـ request (بسبب الـ AuthGuard)
  return this.rolesService.update(id, updateRoleDto, req.user);
}
  @Delete(':id')
@CheckPermissions('manage_roles') // 🛡️ حماية المسار بنفس الصلاحية
remove(
  @Param('id', ParseIntPipe) id: number, 
  @Req() req: any // 👈 استقبل الـ Request كامل هنا أيضاً
) {
  // تمرير الـ id مع الـ user المحقون في الـ request بواسطة الـ Guard
  return this.rolesService.remove(id, req.user);
}
}