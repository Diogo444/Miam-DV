import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { timingSafeEqual, createHash } from 'crypto';
import type { Request } from 'express';
import { MCP_ALL_SCOPES, McpScope } from '../mcp.constants';

export const MCP_SCOPES_KEY = 'mcp_scopes';

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
    const request = context.switchToHttp().getRequest<Request>();

    const apiKeyHeader = request.headers['x-mcp-key'];
    if (typeof apiKeyHeader === 'string') {
      this.validateApiKey(apiKeyHeader, requiredScopes);
      return true;
    }

    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7).trim();
      this.validateJwt(token, requiredScopes);
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
  }

  private validateJwt(token: string, requiredScopes: McpScope[]) {
    if (!this.jwtSecret || !this.jwtService) {
      throw new UnauthorizedException('MCP JWT secret not configured');
    }

    try {
      const payload = this.jwtService.verify(token, { secret: this.jwtSecret });
      const scopes = this.extractScopes(payload);
      this.ensureScopes(scopes, requiredScopes);
    } catch (error) {
      throw new UnauthorizedException('Invalid MCP JWT');
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
