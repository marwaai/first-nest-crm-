import { Injectable, ConflictException, NotFoundException,InternalServerErrorException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from '../roles/roles.entity';
import { CreateUserDto } from './dtos/signup.dto';
import { UpdateUserDto } from './dtos/user.update';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}


  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersRepository
  .createQueryBuilder('user')
  .addSelect('user.password') 
  .leftJoinAndSelect('user.role', 'role') // جلب الرول (مثل: admin)
  .leftJoinAndSelect('role.permissions', 'permissions') // جلب الصلاحيات اللي الأدمن اختارها للرول دي
  .where('user.email = :email', { email })
  .getOne();

    if (user && (await bcrypt.compare(pass, user.password))) {
      // بنمسح الباسورد من الأوبجيكت قبل ما نرجعه للأمان
      const { password, ...result } = user;
      return result as User;
    }
    return null;
  }


  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, ...rest } = createUserDto;
    
    const isExist = await this.usersRepository.findOne({ where: { email } });
    if (isExist) throw new ConflictException('البريد الإلكتروني مستخدم بالفعل');

    const visitorRole = await this.rolesRepository.findOne({ where: { name: 'visitor' } });
    
    if (!visitorRole) {
      throw new InternalServerErrorException('لم يتم العثور على رول Visitor في النظام');
    }

    
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = this.usersRepository.create({
      ...rest,
      email,
      password: hashedPassword,
      role: visitorRole
    });

    const savedUser = await this.usersRepository.save(newUser);
    
    // حذف الباسورد من الرد
    const { password: _, ...result } = savedUser;
    return result as User;
}

 
  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { id },
      relations: ['role', 'role.permissions'] 
    });
    if (!user) throw new NotFoundException('المستخدم غير موجود');
    return user;
  }


  async findOneByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email },
      relations: ['role', 'role.permissions']
    });
  }


  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const { roleId, ...data } = updateUserDto;
    
    // بنستخدم findOne للتأكد من وجود اليوزر الأول
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('المستخدم غير موجود');

    if (roleId) {
      const newRole = await this.rolesRepository.findOneBy({ id: +roleId });
      if (!newRole) throw new NotFoundException('الرول الجديدة غير موجودة');
      user.role = newRole;
    }

  

    Object.assign(user, data);
    const updatedUser = await this.usersRepository.save(user);
    const { password: _, ...result } = updatedUser;
    return result as User;
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('المستخدم غير موجود');
  }
}