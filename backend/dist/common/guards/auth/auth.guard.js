"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var JwtAuthGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = exports.LocalAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
let LocalAuthGuard = class LocalAuthGuard extends (0, passport_1.AuthGuard)('local') {
};
exports.LocalAuthGuard = LocalAuthGuard;
exports.LocalAuthGuard = LocalAuthGuard = __decorate([
    (0, common_1.Injectable)()
], LocalAuthGuard);
let JwtAuthGuard = JwtAuthGuard_1 = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    logger = new common_1.Logger(JwtAuthGuard_1.name);
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            this.logger.warn(`Missing Authorization header on ${req.method} ${req.url}`);
            throw new common_1.UnauthorizedException('Missing Authorization header');
        }
        if (!authHeader.toLowerCase().startsWith('bearer ')) {
            this.logger.warn(`Malformed Authorization header on ${req.method} ${req.url}: ${authHeader}`);
            throw new common_1.UnauthorizedException('Invalid Authorization header format');
        }
        const token = authHeader.slice(7).trim();
        const masked = token.length > 14 ? `${token.slice(0, 6)}...${token.slice(-4)}` : token;
        try {
            const rawPayload = token.split('.')[1];
            if (rawPayload) {
                const decoded = JSON.parse(Buffer.from(rawPayload, 'base64url').toString('utf8'));
                this.logger.debug(`JWT payload for ${req.method} ${req.url}: sub=${decoded?.sub}, role=${decoded?.role}, exp=${decoded?.exp}`);
            }
        }
        catch (decodeErr) {
            this.logger.warn(`Unable to decode JWT payload on ${req.method} ${req.url}: ${decodeErr instanceof Error ? decodeErr.message : decodeErr}`);
        }
        this.logger.debug(`Token received for ${req.method} ${req.url}: ${masked}`);
        return super.canActivate(context);
    }
    handleRequest(err, user, info, ctx) {
        const req = ctx.switchToHttp().getRequest();
        const infoName = info?.name;
        const infoMessage = info?.message;
        if (err || !user) {
            const reason = infoName === 'TokenExpiredError'
                ? 'Token expired, please log in again'
                : infoName === 'JsonWebTokenError'
                    ? 'Invalid token signature'
                    : err instanceof Error
                        ? err.message
                        : infoMessage;
            this.logger.warn(`JWT validation failed for ${req.method} ${req.url}: ${reason ?? err ?? 'no user extracted'}`);
            throw err || new common_1.UnauthorizedException(reason ?? 'Invalid or expired token');
        }
        this.logger.debug(`JWT validated for ${req.method} ${req.url}: user=${user?.username ?? user?.id}, role=${user?.role}`);
        return user;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = JwtAuthGuard_1 = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);
//# sourceMappingURL=auth.guard.js.map