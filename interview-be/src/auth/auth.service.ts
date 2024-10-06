import { Injectable, NotImplementedException, UnauthorizedException } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
    constructor(
      private usersService: UsersService,
      private jwtService: JwtService,
    ) {}

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email)
    
        if (!user)
          return null
    
        const isPasswordValid = await bcrypt.compare(pass, user.password)
        if (!isPasswordValid)
          return null
    
        const { password, ...result } = user

        return result
    }

    async login(user: any) {
      const payload = { email: user.email, id: user.id, role: user.role }

      return {
        access_token: this.jwtService.sign(payload),
      }
    }
}
