import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService, AuthUser } from './auth.service';
import { JwtAuthGuard, LocalAuthGuard } from '../common/guards/auth/auth.guard';
import { RolesGuard } from '../common/guards/auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { LoginDto } from './dto/login.dto';
import type { Request as ExpressRequest } from 'express';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() payload: CreateAdminDto) {
    return this.authService.register(payload);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() _payload: LoginDto, @Request() req: ExpressRequest) {
    const user = req.user as AuthUser;
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('me')
  async me(@Request() req: ExpressRequest) {
    return this.authService.me(req.user as any);
  }
}
