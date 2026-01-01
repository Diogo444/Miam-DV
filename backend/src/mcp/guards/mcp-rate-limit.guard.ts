import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request } from 'express';
import { hashIdentifier } from './mcp.guard';

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

@Injectable()
export class McpRateLimitGuard implements CanActivate {
  private readonly store = new Map<string, RateLimitEntry>();

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const identifier = this.getIdentifier(request);
    const now = Date.now();
    const windowMs = parseInt(process.env.MCP_RATE_LIMIT_WINDOW_MS ?? '60000', 10);
    const max = parseInt(process.env.MCP_RATE_LIMIT_MAX ?? '60', 10);
    const key = `${identifier}:${request.method}:${request.path}`;

    const entry = this.store.get(key);
    if (!entry || entry.resetAt <= now) {
      this.store.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }

    if (entry.count >= max) {
      throw new HttpException('Rate limit exceeded', HttpStatus.TOO_MANY_REQUESTS);
    }

    entry.count += 1;
    return true;
  }

  private getIdentifier(request: Request) {
    const apiKey = request.headers['x-mcp-key'];
    if (typeof apiKey === 'string') {
      return `key:${hashIdentifier(apiKey)}`;
    }
    const auth = request.headers.authorization;
    if (auth?.startsWith('Bearer ')) {
      return `jwt:${hashIdentifier(auth.slice(7))}`;
    }
    const forwarded = request.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.length > 0) {
      return `ip:${forwarded.split(',')[0].trim()}`;
    }
    return `ip:${request.ip ?? 'unknown'}`;
  }
}
