import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
export declare const MCP_SCOPES_KEY = "mcp_scopes";
export type McpAuthInfo = {
    strategy: 'api-key' | 'jwt';
    scopes: string[];
    subject?: string;
};
export type McpAuthenticatedRequest = Request & {
    mcpAuth?: McpAuthInfo;
};
export declare class McpGuard implements CanActivate {
    private readonly reflector;
    private readonly apiKey;
    private readonly apiKeyScopes;
    private readonly jwtSecret;
    private readonly jwtService;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
    private validateApiKey;
    private validateJwt;
    private validateOrigin;
    private ensureScopes;
    private extractScopes;
    private parseScopes;
    private parseOrigins;
}
export declare function hashIdentifier(value: string): string;
