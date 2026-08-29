import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import type { AuthUser } from '../../../auth/auth.service';

type DecodedJwt = {
  sub?: number;
  role?: string;
  exp?: number;
};

type PassportInfo = {
  name?: string;
  message?: string;
};

@Injectable()
export class LocalAuthGuard extends NestAuthGuard('local') {
  constructor() {
    super();
  }
}

@Injectable()
export class JwtAuthGuard extends NestAuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      this.logger.warn(
        `Missing Authorization header on ${req.method} ${req.url}`,
      );
      throw new UnauthorizedException('Missing Authorization header');
    }

    if (!authHeader.toLowerCase().startsWith('bearer ')) {
      this.logger.warn(
        `Malformed Authorization header on ${req.method} ${req.url}: ${authHeader}`,
      );
      throw new UnauthorizedException('Invalid Authorization header format');
    }

    const token = authHeader.slice(7).trim();
    const masked =
      token.length > 14 ? `${token.slice(0, 6)}...${token.slice(-4)}` : token;
    try {
      const rawPayload = token.split('.')[1];
      if (rawPayload) {
        const decoded = JSON.parse(
          Buffer.from(rawPayload, 'base64url').toString('utf8'),
        ) as DecodedJwt;
        this.logger.debug(
          `JWT payload for ${req.method} ${req.url}: sub=${decoded?.sub}, role=${decoded?.role}, exp=${decoded?.exp}`,
        );
      }
    } catch (decodeErr) {
      this.logger.warn(
        `Unable to decode JWT payload on ${req.method} ${req.url}: ${decodeErr instanceof Error ? decodeErr.message : 'unknown decoding error'}`,
      );
    }
    this.logger.debug(`Token received for ${req.method} ${req.url}: ${masked}`);

    return super.canActivate(context) as Promise<boolean>;
  }

  handleRequest<TUser = AuthUser>(
    err: unknown,
    user: unknown,
    info: unknown,
    ctx: ExecutionContext,
  ): TUser {
    const req = ctx.switchToHttp().getRequest<Request>();
    const passportInfo = isPassportInfo(info) ? info : undefined;
    const infoName = passportInfo?.name;
    const infoMessage = passportInfo?.message;

    if (err || !user) {
      const reason =
        infoName === 'TokenExpiredError'
          ? 'Token expired, please log in again'
          : infoName === 'JsonWebTokenError'
            ? 'Invalid token signature'
            : err instanceof Error
              ? err.message
              : infoMessage;

      const message = reason ?? 'Invalid or expired token';
      this.logger.warn(
        `JWT validation failed for ${req.method} ${req.url}: ${message}`,
      );
      throw err instanceof Error ? err : new UnauthorizedException(message);
    }

    if (!isAuthUser(user)) {
      throw new UnauthorizedException('Invalid authenticated user');
    }

    this.logger.debug(
      `JWT validated for ${req.method} ${req.url}: user=${user?.username ?? user?.id}, role=${
        user?.role
      }`,
    );

    return user as TUser;
  }
}

function isPassportInfo(value: unknown): value is PassportInfo {
  return typeof value === 'object' && value !== null;
}

function isAuthUser(value: unknown): value is AuthUser {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Partial<AuthUser>;
  return (
    typeof candidate.id === 'number' &&
    typeof candidate.username === 'string' &&
    typeof candidate.role === 'string'
  );
}
