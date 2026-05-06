import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Patch,
  Delete,
  Param, 
  UseInterceptors, 
  ClassSerializerInterceptor, 
  UseGuards,ParseUUIDPipe
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dtos/signup.dto';
import { UpdateUserDto } from './dtos/user.update'; // Import your new Update DTO
import { UserRole } from './user.entity'; // Import the Enum
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 
import { RolesGuard } from '../auth/guards/roles.guard';
import { SetMetadata } from '@nestjs/common';

// Custom Decorator logic
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 1. PUBLIC SIGNUP: No roles allowed in DTO. Service forces 'agent'.
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }


  // 3. ADMIN ONLY: Delete User
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) 
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // 4. PROTECTED: Get user data (Must be logged in)
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return await this.usersService.findById(id);
  
  }

@Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Security: Ensure only Admins can hit this logic
  async updte(
    @Param('id', ParseUUIDPipe) id: string, // Validates that the ID is a proper UUID
    @Body() updateUserDto: UpdateUserDto    // The data we want to "merge"
  ) {
    // This calls the service method you provided
    return await this.usersService.update(id, updateUserDto);
  }
}
