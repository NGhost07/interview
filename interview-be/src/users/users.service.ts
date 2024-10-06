import { ConflictException, Injectable, NotImplementedException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { RegisterUserDto, UpdateUserDto } from './dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async register(data: RegisterUserDto) {
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
        }
      })
    }

    async findMany(skip: number, take: number) {
      return this.prisma.user.findMany({
          skip,
          take
      })
    }

    async findByUserId(id: string) {
      return this.prisma.user.findUnique({ where: { id: id }})
    }

    async findByEmail(email: string) {
      return this.prisma.user.findUnique({ where: { email: email }})
    }
    
    async update(id: string, updateUserDto: UpdateUserDto) {
      return this.prisma.user.update({
          where: {id: id},
          data: {...updateUserDto},
      })
    }

    async delete(id: string) {
      return this.prisma.user.delete({ where: { id: id }})
    }
}
