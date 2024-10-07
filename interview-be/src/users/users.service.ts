import { ConflictException, Injectable, NotImplementedException, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { RegisterUserDto, UpdateProfileDto, UpdateUserDto } from './dto'
import * as bcrypt from 'bcrypt'
import { Prisma, User } from '@prisma/client'

function createSelectWithoutPassword(): Prisma.UserSelect {
  return {
    id: true,
    full_name: true,
    email: true,
    avata: true,
    phone: true,
    role: true,
    premium_account: true,
    nationality: true,
    is_active: true,
    language: true,
    createAt: true,
    updateAt: true,
  }
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  parseOrderBy(orderBy: string): Prisma.UserOrderByWithRelationInput | undefined {
    if (!orderBy) return undefined

    const [field, direction] = orderBy.split(':')
    return {
      [field]: direction === 'asc' ? 'asc' : 'desc',
    }
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: {email: email }})

    if (!user)
      throw new UnauthorizedException('Invalid email!')

    const isPasswordValid = await bcrypt.compare(pass, user.password)
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid password!')

    const { password, ...result } = user

    return result
  }

  async register(data: RegisterUserDto): Promise<Omit<User, 'password'>> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser)
      throw new ConflictException('Email already exists')

    const hashedPassword = await bcrypt.hash(data.password, 10)
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: createSelectWithoutPassword(),
    })
  }


  async query(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.UserWhereUniqueInput;
      where?: Prisma.UserWhereInput;
      orderBy?: Prisma.UserOrderByWithRelationInput;
    }
  ): Promise<Omit<User, 'password'>[]>{
    const { skip, take, cursor, where, orderBy } = params

    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select: createSelectWithoutPassword(),
    })
  }

  async findByUserId(id: string): Promise<Omit<User, 'password'>> {
    return this.prisma.user.findUnique({ 
      where: { id: id },
      select: createSelectWithoutPassword(),
    })
  }

  async findByEmail(email: string): Promise<Omit<User, 'password'>> {
    return this.prisma.user.findUnique({ 
      where: { email: email },
      select: createSelectWithoutPassword(),
    })
  }
    
  async update(id: string, data: UpdateUserDto): Promise<Omit<User, 'password'>> {
    return this.prisma.user.update({
      where: {id: id},
      data: {...data},
      select: createSelectWithoutPassword(),
    })
  }

  async delete(id: string): Promise<Omit<User, 'password'>> {
    return this.prisma.user.delete({ 
      where: { id: id },
      select: createSelectWithoutPassword(),
    })
  }

  async updateProfile(id: string, data: UpdateProfileDto): Promise<Omit<User, 'password'>> {
    const { password, ...newData } = data
    return this.prisma.user.update({
      where: { id: id },
      data: {
        password: await bcrypt.hash(password, 10),
        ...newData,
      },
      select: createSelectWithoutPassword(),
    })
  }
}
