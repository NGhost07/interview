import { Injectable, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
    constructor(
      private jwtService: JwtService,
    ) {}

    // async validateUser(email: string, pass: string): Promise<any> {
    //   const user = await this.prisma.user.findUnique({ where: {email: email }})
  
    //   if (!user)
    //     throw new UnauthorizedException('Invalid email!')
  
    //   const isPasswordValid = await bcrypt.compare(pass, user.password)
    //   if (!isPasswordValid)
    //     throw new UnauthorizedException('Invalid password!')
  
    //   const { password, ...result } = user

    //   return result
    // }

    // async login(user: any) {
    //   const payload = { email: user.email, id: user.id, role: user.role }

    //   return {
    //     access_token: this.jwtService.sign(payload),
    //   }
    // }
}
