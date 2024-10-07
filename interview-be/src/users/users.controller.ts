import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { QueryUserDto, RegisterUserDto, UpdateProfileDto, UpdateUserDto } from './dto'
import { GetUserId, Public, Roles } from 'src/auth/decorators';
import { RolesGuard } from 'src/auth/guards';
import { Prisma, Role, User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ALL USER
  @Public()
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<Omit<User, 'password'>> {

    return this.usersService.register(registerUserDto)
  }

  @Get('profile')
  async getProfile(@GetUserId() id: string): Promise<Omit<User, 'password'>> {
    return this.usersService.findByUserId(id)
  }

  @Patch('profile')
  async updateProfile(
    @GetUserId() id: string, 
    @Body() updateProfileDto: UpdateProfileDto
  ): Promise<Omit<User, 'password'>> {
    return this.usersService.updateProfile(id, updateProfileDto)
  }

  @Post('query')
  async query (@Body() queryUserDto: QueryUserDto): Promise<Omit<User, 'password'>[]> {
    const { full_name, email, phone, role, premium_account, nationality, is_active, language } = queryUserDto
    const params: {
      skip?: number
      take?: number
      where?: Prisma.UserWhereInput
      orderBy?: Prisma.UserOrderByWithRelationInput
      cursor?: Prisma.UserWhereUniqueInput
    } = {
      skip: +queryUserDto.skip || 0,
      take: +queryUserDto.take || 10,
      orderBy: this.usersService.parseOrderBy(queryUserDto.orderBy),
      where: {
        ...( full_name && { full_name: { contains: full_name, mode: 'insensitive' }}),
        ...( email && { email: { contains: email, mode: 'insensitive' }}),
        ...( phone && { phone: { contains: phone, mode: 'insensitive' }}),
        ...( role && { role: role}),
        ...( premium_account && { premium_account: premium_account}),
        ...( nationality && { nationality: nationality}),
        ...( is_active && { is_active: is_active}),
        ...( language && { language: language}),
      },
      cursor: queryUserDto.cursorId ? { id: queryUserDto.cursorId } : undefined,
    }

    return this.usersService.query(params)
  }

  // ADMIN
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto
  ): Promise<Omit<User, 'password'>> {
    return this.usersService.update(id, updateUserDto)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Omit<User, 'password'>> {
    return this.usersService.delete(id)
  }

  // ADMIN || TRAINER 
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TRAINER)
  @Get()
  async queryParam(
    @Query('skip') skip?: string, 
    @Query('take') take?: string, 
  ): Promise<Omit<User, 'password'>[]> {
    const params = { skip: +skip || 0, take: +take || 10 }

    return this.usersService.query(params)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TRAINER)
  @Get(':id')
  async findByUserId(@Param('id') id: string): Promise<Omit<User, 'password'>> {
    return this.usersService.findByUserId(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TRAINER)
  @Get('user/:email')
  async findByEmail(@Param('email') email: string): Promise<Omit<User, 'password'>> {
    return this.usersService.findByEmail(email)
  }
}
