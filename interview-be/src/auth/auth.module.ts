import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy, LocalStrategy } from './strategies'
import { JwtModule } from '@nestjs/jwt'
import { AuthGateway } from './gateway/auth.gateway'
import { UsersModule } from 'src/users/users.module'

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
  providers: [LocalStrategy, JwtStrategy, AuthGateway],
  controllers: [],
  exports: [],
})
export class AuthModule {}