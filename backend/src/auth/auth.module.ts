import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard, LocalAuthGuard } from '../common/guards/auth/auth.guard';
import { RolesGuard } from '../common/guards/auth/roles.guard';


@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'changeme',
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN as StringValue | number | undefined) ?? '1d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, LocalAuthGuard, JwtAuthGuard, RolesGuard],
  exports: [AuthService, LocalAuthGuard, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
