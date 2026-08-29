import { ExecutionContext } from '@nestjs/common';
import type { AuthUser } from '../../../auth/auth.service';
declare const LocalAuthGuard_base: import("@nestjs/passport", { with: { "resolution-mode": "import" } }).Type<import("@nestjs/passport", { with: { "resolution-mode": "import" } }).IAuthGuard>;
export declare class LocalAuthGuard extends LocalAuthGuard_base {
    constructor();
}
declare const JwtAuthGuard_base: import("@nestjs/passport", { with: { "resolution-mode": "import" } }).Type<import("@nestjs/passport", { with: { "resolution-mode": "import" } }).IAuthGuard>;
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    private readonly logger;
    constructor();
    canActivate(context: ExecutionContext): Promise<boolean>;
    handleRequest<TUser = AuthUser>(err: unknown, user: unknown, info: unknown, ctx: ExecutionContext): TUser;
}
export {};
