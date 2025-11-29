import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async validateUser(username: string, password: string) {
    const user = await this.users.findByUsername(username);
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    return match ? this.toSafeUser(user) : null;
  }

  async register(payload: CreateUserDto) {
    const existing = await this.users.findByUsername(payload.username);

    if (existing) {
      throw new ConflictException('Username already exists');
    }

    const role = payload.role || 'admin';
    const user = await this.users.create(payload.username, payload.password, role);

    return this.buildAuthResponse(user);
  }

  async login(user: any) {
    return this.buildAuthResponse(user);
  }

  async me(user: { id: number }) {
    const freshUser = await this.users.findById(user.id);

    if (!freshUser) {
      throw new UnauthorizedException('User not found');
    }

    return { user: this.toSafeUser(freshUser) };
  }

  private buildAuthResponse(user: User) {
    const payload = { sub: user.id, role: user.role };
    return {
      access_token: this.jwt.sign(payload),
      user: this.toSafeUser(user),
    };
  }

  private toSafeUser(user: User) {
    const { password, ...safeUser } = user;
    return safeUser;
  }
}
