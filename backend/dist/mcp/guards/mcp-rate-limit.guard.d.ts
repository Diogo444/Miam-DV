import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class McpRateLimitGuard implements CanActivate {
    private readonly store;
    canActivate(context: ExecutionContext): boolean;
    private getIdentifier;
}
