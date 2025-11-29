import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard, LocalAuthGuard } from '../common/guards/auth/auth.guard';
import { RolesGuard } from '../common/guards/auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import type { Request as ExpressRequest } from 'express';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() payload: CreateUserDto) {
    return this.authService.register(payload);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() _payload: LoginDto, @Request() req: ExpressRequest) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('me')
  async me(@Request() req: ExpressRequest) {
    return this.authService.me(req.user as any);
  }
}
