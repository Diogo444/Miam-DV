import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export declare const MCP_SCOPES_KEY = "mcp_scopes";
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
    private ensureScopes;
    private extractScopes;
    private parseScopes;
}
export declare function hashIdentifier(value: string): string;
