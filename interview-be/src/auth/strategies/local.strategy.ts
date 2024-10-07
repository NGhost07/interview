import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({ usernameField: 'email'})
  }

  async validate(email: string, password: string): Promise<any> {
    return this.usersService.validateUser(email, password)
  }
}