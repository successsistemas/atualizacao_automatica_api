import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { Module } from '@nestjs/common'
import { LocalStrategy } from './guards/strategies/local.strategy'
import { UserModule } from 'src/user/user.module'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './constant'
import { JwtStrategy } from './guards/strategies/jwt.strategy'

@Module({
  imports: [
    AuthModule,
    UserModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '20d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
