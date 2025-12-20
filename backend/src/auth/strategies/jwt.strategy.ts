import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdminService } from '../../admin/admin.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private adminService: AdminService) {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET must be defined');
    }

    const maskedSecret =
      secret.length > 8 ? `${secret.slice(0, 4)}...${secret.slice(-4)}` : secret;
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });

    this.logger.debug(
      `JwtStrategy init: using secret length=${secret.length}, masked=${maskedSecret}`,
    );
  }

  async validate(payload: any) {
    this.logger.debug(
      `validate() called with payload sub=${payload?.sub}, role=${payload?.role}, exp=${payload?.exp}`,
    );
    const user = await this.adminService.findById(payload.sub);

    if (!user) {
      this.logger.warn(`User not found for sub=${payload?.sub}`);
      throw new UnauthorizedException('User not found');
    }

    this.logger.debug(
      `User resolved for sub=${payload?.sub}: username=${user.username}, role=${user.role}`,
    );

    return {
      id: user.id,
      username: user.username,
      role: user.role,
    };
  }
}
