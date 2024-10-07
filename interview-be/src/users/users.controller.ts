import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { QueryUserDto, RegisterUserDto, UpdateProfileDto, UpdateUserDto } from './dto'
import { GetUserId, Public, Roles } from 'src/auth/decorators';
import { RolesGuard } from 'src/auth/guards';
import { Prisma, Role, User } from '@prisma/client';
import { ApiBadRequestResponse, ApiConflictResponse, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ALL USER
  @ApiOperation({ summary: 'Register new user' })
  @ApiOkResponse({ description: 'Successfully register user!' })
  @ApiConflictResponse({ description: 'Email already exists' })
  @Public()
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<Omit<User, 'password'>> {

    return this.usersService.register(registerUserDto)
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized!' })
  @ApiOkResponse({ description: 'Ok' })
  @Get('profile')
  async getProfile(@GetUserId() id: string): Promise<Omit<User, 'password'>> {
    return this.usersService.findByUserId(id)
  }

  @ApiOperation({ summary: 'Update user profile' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized!' })
  @ApiOkResponse({ description: 'Ok' })
  @ApiBadRequestResponse({ 
    description: 'BadRequest',
    type: UpdateProfileDto 
  })
  @Patch('profile')
  async updateProfile(
    @GetUserId() id: string, 
    @Body() updateProfileDto: UpdateProfileDto
  ): Promise<Omit<User, 'password'>> {
    return this.usersService.updateProfile(id, updateProfileDto)
  }

  @ApiOperation({ summary: 'Query users by body' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized!' })
  @ApiOkResponse({ description: 'Ok' })
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
  @ApiOperation({ summary: 'Update user by id' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized!' })
  @ApiForbiddenResponse({ description: 'Forbidden: Requires ADMIN rights' })
  @ApiBadRequestResponse({ 
    description: 'BadRequest',
    type: UpdateUserDto, 
  })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto
  ): Promise<Omit<User, 'password'>> {
    return this.usersService.update(id, updateUserDto)
  }

  @ApiOperation({ summary: 'Delete user by id' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized!' })
  @ApiForbiddenResponse({ description: 'Forbidden: Requires ADMIN rights' })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Omit<User, 'password'>> {
    return this.usersService.delete(id)
  }

  // ADMIN || TRAINER 
  @ApiOperation({ summary: 'Query user by param' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized!' })
  @ApiForbiddenResponse({ description: 'Forbidden: Requires ADMIN or TRAINER rights' })
  @ApiOkResponse({ description: 'Ok' })
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

  @ApiOperation({ summary: 'Find user by id' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized!' })
  @ApiForbiddenResponse({ description: 'Forbidden: Requires ADMIN or TRAINER rights' })
  @ApiOkResponse({ description: 'Ok' })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TRAINER)
  @Get(':id')
  async findByUserId(@Param('id') id: string): Promise<Omit<User, 'password'>> {
    return this.usersService.findByUserId(id);
  }

  @ApiOperation({ summary: 'Find user by email'})
  @ApiUnauthorizedResponse({ description: 'Unauthorized!' })
  @ApiForbiddenResponse({ description: 'Forbidden: Requires ADMIN or TRAINER rights' })
  @ApiOkResponse({ description: 'Ok' })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TRAINER)
  @Get('user/:email')
  async findByEmail(@Param('email') email: string): Promise<Omit<User, 'password'>> {
    return this.usersService.findByEmail(email)
  }
}
