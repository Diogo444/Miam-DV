"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpRateLimitGuard = void 0;
const common_1 = require("@nestjs/common");
const mcp_guard_1 = require("./mcp.guard");
let McpRateLimitGuard = class McpRateLimitGuard {
    store = new Map();
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
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
            throw new common_1.HttpException('Rate limit exceeded', common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        entry.count += 1;
        return true;
    }
    getIdentifier(request) {
        const apiKey = request.headers['x-mcp-key'];
        if (typeof apiKey === 'string') {
            return `key:${(0, mcp_guard_1.hashIdentifier)(apiKey)}`;
        }
        const auth = request.headers.authorization;
        if (auth?.startsWith('Bearer ')) {
            return `jwt:${(0, mcp_guard_1.hashIdentifier)(auth.slice(7))}`;
        }
        const forwarded = request.headers['x-forwarded-for'];
        if (typeof forwarded === 'string' && forwarded.length > 0) {
            return `ip:${forwarded.split(',')[0].trim()}`;
        }
        return `ip:${request.ip ?? 'unknown'}`;
    }
};
exports.McpRateLimitGuard = McpRateLimitGuard;
exports.McpRateLimitGuard = McpRateLimitGuard = __decorate([
    (0, common_1.Injectable)()
], McpRateLimitGuard);
//# sourceMappingURL=mcp-rate-limit.guard.js.map