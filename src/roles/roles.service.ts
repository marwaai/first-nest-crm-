import { 
  Injectable, 
  NotFoundException, 
  ConflictException ,BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from './roles.entity';
import { Permission } from './permission.entity';
import { CreateRoleDto } from './dtos/create.role.dto';
import { UpdateRoleDto } from './dtos/update.role.dto';
@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const { name, description, permissionIds } = createRoleDto;
    // داخل دالة update في roles.service.ts
if (createRoleDto.permissionIds && createRoleDto.permissionIds.includes(19)) {
  throw new BadRequestException(
    'أمنياً: الصلاحية رقم 19 (إنشاء الأدوار) مقفلة من قبل النظام ولا يمكن منحها أو تعديلها عبر الـ API.',
  );
}

    const exists = await this.roleRepository.findOne({ where: { name } });
    if (exists) throw new ConflictException('هذا الدور موجود بالفعل');

    // جلب كائنات الصلاحيات بناءً على الـ IDs المبعوثة
    const permissions = permissionIds?.length 
      ? await this.permissionRepository.findBy({ id: In(permissionIds) })
      : [];

    const role = this.roleRepository.create({ name, description, permissions });
    return await this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find({ relations: ['permissions'] });
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!role) throw new NotFoundException(`الدور رقم ${id} غير موجود`);
    return role;
  }

async update(id: number, updateRoleDto: UpdateRoleDto, currentUser: any): Promise<Role> {
    // 🛡️ 1. حماية بيانات الأدمن الأساسي للنظام من التعديل (عبر الـ id الثابت)
    // داخل دالة update في roles.service.ts
if (updateRoleDto.permissionIds && updateRoleDto.permissionIds.includes(19)) {
  throw new BadRequestException(
    'أمنياً: الصلاحية رقم 19 (إنشاء الأدوار) مقفلة من قبل النظام ولا يمكن منحها أو تعديلها عبر الـ API.',
  );
}
    if (id === 1) {
      throw new BadRequestException(
        `عذراً، لا يمكن تعديل بيانات الدور الأساسي للنظام (رقم 1) لضمان استقرار السيستم.`,
      );
    }
    
    // جلب الدور المراد تعديله من الداتابيز
    const role = await this.findOne(id); 

    // 🛡️ [تعديل الحماية الذاتية]: المقارنة هنا تمت عبر الـ name النصي القادم من التوكن
    if (currentUser.role === role.name) {
      throw new BadRequestException(
        'أمنياً: لا يمكنك تعديل صلاحيات أو بيانات الدور المرتبط بحسابك الحالي بنفسك، يرجى طلب ذلك من مسؤول نظام آخر.',
      );
    }
    
    const { name, description, permissionIds } = updateRoleDto;

    // 🛡️ 2. حماية الـ Unique Name
    if (name && name !== role.name) {
      const nameExists = await this.roleRepository.findOne({ where: { name } });
      if (nameExists) throw new ConflictException('هذا الاسم مستخدم بالفعل لدور آخر');
      role.name = name;
    }

    // 📝 تعديل الـ Description
    if (description !== undefined) {
      role.description = description.trim();
    }
    
    // 🔐 3. منع تصعيد الصلاحيات (Privilege Escalation Block)
    if (permissionIds !== undefined) {
      // حماية ممتدة: إذا كان المستخدم ليس الـ Super Admin الأساسي (صاحب الاسم المحمي مثلاً)
      if (currentUser.role !== 'admin') { 
        
        const targetPermissions = await this.permissionRepository.findBy({ id: In(permissionIds) });
        const userPermissions = currentUser.permissions || []; 

        const hasInjectedHigherPermission = targetPermissions.some(
          (perm) => !userPermissions.includes(perm.slug) // 👈 تم التعديل إلى slug ليطابق الـ AuthService الخاص بك
        );

        if (hasInjectedHigherPermission) {
          throw new BadRequestException(
            'أمنياً: لا يمكنك منح صلاحيات في هذا الدور أعلى من صلاحيات حسابك الحالي.',
          );
        }
        
        role.permissions = targetPermissions;
      } else {
        // إذا كان أدمن خارق، نأتي بالصلاحيات ونربطها مباشرة
        role.permissions = await this.permissionRepository.findBy({ id: In(permissionIds) });
      }
    }

    return await this.roleRepository.save(role);
}
 
async remove(id: number, currentUser: any): Promise<void> {
  // 🛡️ 1. حماية الأدوار الثابتة للنظام من الحذف نهائياً لضمان استقرار السيستم
  if (id === 1 || id === 2) {
    throw new BadRequestException(
      `عذراً، لا يمكن حذف الأدوار الأساسية للنظام (رقم 1 ورقم 2) لضمان استقرار السيستم.`,
    );
  }

  // 🔍 2. جلب الدور المراد حذفه مع الصلاحيات المرتبطة به (استخدمنا findOne مع relations)
  const role = await this.roleRepository.findOne({
    where: { id },
    relations: ['permissions'], // 👈 خطوة أساسية لكي يسحب السيستم مصفوفة صلاحيات الدور المراد حذفه
  });

  if (!role) {
    throw new NotFoundException('عذراً، هذا الدور غير موجود في النظام.');
  }

  // 🛡️ 3. [الحماية الذاتية]: منع المستخدم من حذف الدور المرتبط بحسابه الحالي
  if (currentUser.role === role.name) {
    throw new BadRequestException(
      'أمنياً: لا يمكنك حذف الدور المرتبط بحسابك الحالي بنفسك تجنباً لتخريب حسابك.',
    );
  }

  // 🔐 4. [حماية التراتبية]: منع حذف الأدوار الأعلى أو التي تقع خارج نطاق اختصاصك
  // هذا الجزء هو الذي يمنع المحاسب من حذف المدير ويسمح للمدير بحذف مرؤوسيه
  if (currentUser.role !== 'Super Admin' && currentUser.role !== 'admin') {
    const userPermissions = currentUser.permissions || [];
    const targetRolePermissions = role.permissions?.map(p => p.slug) || [];

    // الفحص الحاسم: هل الدور المراد حذفه يحتوي على صلاحية واحدة على الأقل ليست عند المستخدم الحالي؟
    const hasHigherOrDifferentPermission = targetRolePermissions.some(
      (slug) => !userPermissions.includes(slug)
    );

    if (hasHigherOrDifferentPermission) {
      throw new BadRequestException(
        'أمنياً: لا يمكنك حذف دور يمتلك صلاحيات أعلى أو تختلف عن صلاحيات حسابك الحالي (خارج نطاق اختصاصك).',
      );
    }
  }

  // 🗑️ 5. الحذف الفعلي بأمان بعد تخطي كل جدران الحماية
  await this.roleRepository.remove(role);
}}