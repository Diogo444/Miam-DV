import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Injectable()
export class LocalAuthGuard extends NestAuthGuard('local') {}

@Injectable()
export class JwtAuthGuard extends NestAuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      this.logger.warn(`Missing Authorization header on ${req.method} ${req.url}`);
      throw new UnauthorizedException('Missing Authorization header');
    }

    if (!authHeader.toLowerCase().startsWith('bearer ')) {
      this.logger.warn(`Malformed Authorization header on ${req.method} ${req.url}: ${authHeader}`);
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
        );
        this.logger.debug(
          `JWT payload for ${req.method} ${req.url}: sub=${decoded?.sub}, role=${decoded?.role}, exp=${decoded?.exp}`,
        );
      }
    } catch (decodeErr) {
      this.logger.warn(
        `Unable to decode JWT payload on ${req.method} ${req.url}: ${decodeErr instanceof Error ? decodeErr.message : decodeErr}`,
      );
    }
    this.logger.debug(
      `Token received for ${req.method} ${req.url}: ${masked}`,
    );

    return super.canActivate(context) as Promise<boolean>;
  }

  handleRequest(err: unknown, user: any, info: unknown, ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest<Request>();
    const infoName = (info as any)?.name as string | undefined;
    const infoMessage = (info as any)?.message as string | undefined;

    if (err || !user) {
      const reason =
        infoName === 'TokenExpiredError'
          ? 'Token expired, please log in again'
          : infoName === 'JsonWebTokenError'
            ? 'Invalid token signature'
            : err instanceof Error
              ? err.message
              : infoMessage;

      this.logger.warn(
        `JWT validation failed for ${req.method} ${req.url}: ${reason ?? err ?? 'no user extracted'}`,
      );
      throw err || new UnauthorizedException(reason ?? 'Invalid or expired token');
    }

    this.logger.debug(
      `JWT validated for ${req.method} ${req.url}: user=${user?.username ?? user?.id}, role=${
        user?.role
      }`,
    );

    return user;
  }
}
