import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { RegisterUserDto, UpdateUserDto } from './dto'
import { GetUserId, Public, Roles } from 'src/auth/decorators';
import { RolesGuard } from 'src/auth/guards';
import { Role } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const user = await this.usersService.register(registerUserDto)
    if (user) {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    }
    
    return null
  }

  @Get('profile')
  async getProfile(@GetUserId() id: string) {
    return this.usersService.findByUserId(id)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async findMany(@Query('skip') skip: string, @Query('take') take: string) {
    const skipNumber = parseInt(skip) || 0
    const takeNumber = parseInt(take) || 10

    const users = await this.usersService.findMany(skipNumber, takeNumber)
    return users.map(({ password, ...userWithoutPassword }) => userWithoutPassword)
  }

  @Get(':id')
  async findByUserId(@Param('id') id: string) {
    const user = await this.usersService.findByUserId(id)
    if (user) {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    }
    
    return null
  }

  @Get('user/:email')
  async findByEmail(@Param('email') email: string) {
    const user = await this.usersService.findByEmail(email)
    if (user) {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    }
    
    return null
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto)
    if (user) {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    }
    
    return null
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const user = await this.usersService.delete(id)
    if (user) {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    }
    
    return null
  }
}
