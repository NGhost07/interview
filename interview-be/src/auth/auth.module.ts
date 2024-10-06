import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UsersModule } from 'src/users/users.module'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy, LocalStrategy } from './strategies'
import { JwtModule } from '@nestjs/jwt'
import { AuthGateway } from './gateway/auth.gateway'

@Module({
  imports: [
    UsersModule, 
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_AT_SECRET,
        signOptions: {
          expiresIn: process.env.JWT_AT_EXPIRES_IN,
        },
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, AuthGateway],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}