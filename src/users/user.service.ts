// users/users.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async findOneByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();

    return user ?? undefined; 
  }

  async create(userData: Partial<User>): Promise<User> {
    const existingUser = await this.findOneByEmail(userData.email!);
    if (existingUser) {
      throw new ConflictException('البريد الإلكتروني مسجل مسبقاً');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userData.password!, salt);

    const newUser = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(newUser);
    
    const { password, ...result } = savedUser;
    return result as User;
  }

    async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { id },
      relations: ['deals', 'activities'] 
    });
    
    if (!user) {
      throw new NotFoundException('المستخدم غير موجود');
    }
    
    return user;
  }
  async validateUser(email: string, pass: string): Promise<any> {
  const user = await this.findOneByEmail(email); // التي تستخدم addSelect لربط الباسورد
  
  if (user && await bcrypt.compare(pass, user.password)) {
    const { password, ...result } = user;
    return result;
  }
  return null;
}
// 5. مسح يوزر (اللي حددنا صلاحيتها للأدمن في الكنترولر)
  async remove(id: string): Promise<void> {
    const user = await this.findById(id); // بنتأكد إنه موجود الأول
    await this.usersRepository.remove(user);
  }
}
