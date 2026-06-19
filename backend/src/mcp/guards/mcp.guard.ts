import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { timingSafeEqual, createHash } from 'crypto';
import type { Request } from 'express';
import { MCP_ALL_SCOPES, McpScope } from '../mcp.constants';

export const MCP_SCOPES_KEY = 'mcp_scopes';

export type McpAuthInfo = {
  strategy: 'api-key' | 'jwt';
  scopes: string[];
  subject?: string;
};

export type McpAuthenticatedRequest = Request & {
  mcpAuth?: McpAuthInfo;
};

@Injectable()
export class McpGuard implements CanActivate {
  private readonly apiKey = process.env.MCP_API_KEY;
  private readonly apiKeyScopes = this.parseScopes(process.env.MCP_API_KEY_SCOPES);
  private readonly jwtSecret = process.env.MCP_JWT_SECRET;
  private readonly jwtService = this.jwtSecret
    ? new JwtService({ secret: this.jwtSecret })
    : null;

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredScopes =
      this.reflector.getAllAndOverride<McpScope[]>(MCP_SCOPES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];
    const request = context.switchToHttp().getRequest<McpAuthenticatedRequest>();

    this.validateOrigin(request);

    const apiKeyHeader = request.headers['x-mcp-key'];
    if (typeof apiKeyHeader === 'string') {
      const scopes = this.validateApiKey(apiKeyHeader, requiredScopes);
      request.mcpAuth = { strategy: 'api-key', scopes };
      return true;
    }

    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7).trim();
      request.mcpAuth = this.validateJwt(token, requiredScopes);
      return true;
    }

    throw new UnauthorizedException('Missing MCP credentials');
  }

  private validateApiKey(apiKey: string, requiredScopes: McpScope[]) {
    if (!this.apiKey) {
      throw new UnauthorizedException('MCP API key not configured');
    }
    if (!safeEqual(apiKey, this.apiKey)) {
      throw new UnauthorizedException('Invalid MCP API key');
    }

    const scopes =
      this.apiKeyScopes.length > 0 ? this.apiKeyScopes : MCP_ALL_SCOPES;
    this.ensureScopes(scopes, requiredScopes);
    return scopes;
  }

  private validateJwt(token: string, requiredScopes: McpScope[]) {
    if (!this.jwtSecret || !this.jwtService) {
      throw new UnauthorizedException('MCP JWT secret not configured');
    }

    let payload: unknown;
    try {
      payload = this.jwtService.verify(token, { secret: this.jwtSecret });
    } catch (error) {
      throw new UnauthorizedException('Invalid MCP JWT');
    }

    const scopes = this.extractScopes(payload);
    this.ensureScopes(scopes, requiredScopes);
    return {
      strategy: 'jwt' as const,
      scopes,
      subject: extractSubject(payload),
    };
  }

  private validateOrigin(request: Request) {
    const origin = request.headers.origin;
    if (typeof origin !== 'string') {
      return;
    }

    const allowedOrigins = this.parseOrigins(process.env.MCP_ALLOWED_ORIGINS);
    if (allowedOrigins.length > 0) {
      if (!allowedOrigins.includes(origin)) {
        throw new ForbiddenException('MCP origin is not allowed');
      }
      return;
    }

    if (!isLocalOrigin(origin)) {
      throw new ForbiddenException('MCP origin is not allowed');
    }
  }

  private ensureScopes(scopes: string[], requiredScopes: McpScope[]) {
    if (requiredScopes.length === 0) {
      return;
    }
    const missing = requiredScopes.filter((scope) => !scopes.includes(scope));
    if (missing.length > 0) {
      throw new UnauthorizedException('Missing MCP scope');
    }
  }

  private extractScopes(payload: unknown): string[] {
    if (!payload || typeof payload !== 'object') {
      return [];
    }
    const raw = payload as Record<string, unknown>;
    const scopeValue = raw.scope;
    const scopesValue = raw.scopes ?? raw.permissions;
    if (Array.isArray(scopesValue)) {
      return scopesValue.filter((entry): entry is string => typeof entry === 'string');
    }
    if (typeof scopeValue === 'string') {
      return this.parseScopes(scopeValue);
    }
    return [];
  }

  private parseScopes(raw?: string) {
    if (!raw) {
      return [];
    }
    return raw
      .split(/[,\s]+/)
      .map((scope) => scope.trim())
      .filter(Boolean);
  }

  private parseOrigins(raw?: string) {
    if (!raw) {
      return [];
    }
    return raw
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);
  }
}

function safeEqual(value: string, expected: string) {
  const valueBuf = Buffer.from(value);
  const expectedBuf = Buffer.from(expected);
  if (valueBuf.length !== expectedBuf.length) {
    return false;
  }
  return timingSafeEqual(valueBuf, expectedBuf);
}

export function hashIdentifier(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

function extractSubject(payload: unknown) {
  if (!payload || typeof payload !== 'object') {
    return undefined;
  }
  const subject = (payload as Record<string, unknown>).sub;
  return typeof subject === 'string' ? subject : undefined;
}

function isLocalOrigin(origin: string) {
  try {
    const url = new URL(origin);
    return ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  } catch (error) {
    return false;
  }
}
