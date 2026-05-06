import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

 async login(loginDto: any) {
    const user = await this.usersService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('بيانات الدخول غلط');
    }
    
    // ركزي في القفلة هنا
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role 
    }; 

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

}