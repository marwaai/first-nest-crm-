// src/database/seed/seed.service.ts
import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../../roles/permission.entity'; // تأكدي من المسارات عندك
import { Role } from '../../roles/roles.entity';             // مسار إنتيتي الـ Role
import { User } from '../../users/user.entity';             // مسار إنتيتي الـ User
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // الهوك ده بيشتغل تلقائياً أول ما السيرفر يقوم تماماً
  async onApplicationBootstrap() {
    this.logger.log('🌱 Starting Database Seeding Process...');
    
    // 1. سيد الصلاحيات أولاً
    await this.seedPermissions();
    
    // 2. سيد رول الأدمن واربطها بالصلاحيات
    const adminRole = await this.seedAdminRole();
    
    // 3. سيد مستخدم الأدمن واربطه بالرول
    if (adminRole) {
      await this.seedAdminUser(adminRole);
    }
    
    this.logger.log('✨ Seeding Process Finished.');
  }

  private async seedPermissions() {
    const systemPermissions = [
      // --- COMPANIES SERVICE ---
      { action: 'companies_create', label: 'إضافة شركات', slug: 'companies-create' },
      { action: 'companies_read', label: 'عرض الشركات', slug: 'companies-read' },
      { action: 'companies_update', label: 'تعديل بيانات الشركات', slug: 'companies-update' },
      { action: 'companies_delete', label: 'حذف شركات', slug: 'companies-delete' },

      // --- CONTACTS SERVICE ---
      { action: 'contacts_create', label: 'إضافة جهات اتصال', slug: 'contacts-create' },
      { action: 'contacts_read', label: 'عرض جهات الاتصال', slug: 'contacts-read' },
      { action: 'contacts_update', label: 'تعديل جهات الاتصال', slug: 'contacts-update' },
      { action: 'contacts_delete', label: 'حذف جهات اتصال', slug: 'contacts-delete' },

      // --- DEALS SERVICE ---
      { action: 'deals_create', label: 'إضافة صفقات', slug: 'deals-create' },
      { action: 'deals_read', label: 'عرض الصفقات', slug: 'deals-read' },
      { action: 'deals_update', label: 'تعديل صفقات', slug: 'deals-update' },
      { action: 'deals_delete', label: 'حذف صفقات', slug: 'deals-delete' },

      // --- USERS MANAGEMENT SERVICE ---
      { action: 'users_create', label: 'إضافة موظفين', slug: 'users-create' },
      { action: 'users_read', label: 'عرض الموظفين', slug: 'users-read' },
      { action: 'users_update', label: 'تعديل بيانات الموظفين', slug: 'users-update' },
      { action: 'users_delete', label: 'تعطيل / حذف موظف', slug: 'users-delete' },

      // --- ROLES & PERMISSIONS MANAGEMENT SERVICE ---
      { action: 'view_roles', label: 'عرض الأدوار والصلاحيات', slug: 'view_roles' },
      { action: 'manage_roles', label: 'تعديل  الأدوار والصلاحيات', slug: 'manage_roles' },
            { action: 'creare_roles', label: ' إنشاء الأدوار والصلاحيات', slug: 'create_roles' }

    ];

    let insertedCount = 0;

    for (const perm of systemPermissions) {
      const exists = await this.permissionRepository.findOne({ where: { action: perm.action } });
      
      if (!exists) {
        const newPermission = this.permissionRepository.create(perm);
        await this.permissionRepository.save(newPermission);
        insertedCount++;
      }
    }

    if (insertedCount > 0) {
      this.logger.log(`Successfully seeded ${insertedCount} new system permissions.`);
    } else {
      this.logger.log('Permissions table is already fully up-to-date.');
    }
  }

  private async seedAdminRole(): Promise<Role> {
    // التشييك على رول الأدمن
    let adminRole = await this.roleRepository.findOne({ where: { name: 'admin' } });
    
    // هنجيب كل الصلاحيات من الداتابيز عشان نربطها بالأدمن
    const allPermissions = await this.permissionRepository.find();

    if (!adminRole) {
      this.logger.log('🚀 Admin role not found. Creating admin role with all permissions...');
      adminRole = this.roleRepository.create({
        name: 'admin',
        description: 'Super Administrator with full access',
        permissions: allPermissions // ربط كل الصلاحيات بالرول فوراً
      });
      adminRole = await this.roleRepository.save(adminRole);
      this.logger.log('✅ Admin role created successfully.');
    } else {
      // لو الرول موجودة بس ضفنا صلاحيات جديدة في الكود، بنعمل لها تحديث هنا
      adminRole.permissions = allPermissions;
      adminRole = await this.roleRepository.save(adminRole);
      this.logger.log('✨ Admin role permissions synchronized.');
    }

    return adminRole;
  }

  private async seedAdminUser(adminRole: Role) {
    const adminEmail = 'admin@noval.com';
    const adminExists = await this.userRepository.findOne({ where: { email: adminEmail } });

    if (!adminExists) {
      this.logger.log('🚀 Creating default Super Admin user...');
      
      // تشفير الباسورد بنفس الـ bcrypt والـ setup بتاع الكود لمنع الـ 401
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash('123456', salt);

      const adminUser = this.userRepository.create({
        firstName: 'Marwa',
        lastName: 'Mahmoud',
        email: adminEmail,
        password: hashedPassword,
        isActive: true,
        role: adminRole, // ربطه بالرول اللي لسه جايبينها
      });

      await this.userRepository.save(adminUser);
      this.logger.log(`✅ Super Admin created successfully! (${adminEmail} / 123456)`);
    } else {
      this.logger.log('✨ Super Admin user already exists in database.');
    }
  }
}