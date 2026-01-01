"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpGuard = exports.MCP_SCOPES_KEY = void 0;
exports.hashIdentifier = hashIdentifier;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const crypto_1 = require("crypto");
const mcp_constants_1 = require("../mcp.constants");
exports.MCP_SCOPES_KEY = 'mcp_scopes';
let McpGuard = class McpGuard {
    reflector;
    apiKey = process.env.MCP_API_KEY;
    apiKeyScopes = this.parseScopes(process.env.MCP_API_KEY_SCOPES);
    jwtSecret = process.env.MCP_JWT_SECRET;
    jwtService = this.jwtSecret
        ? new jwt_1.JwtService({ secret: this.jwtSecret })
        : null;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredScopes = this.reflector.getAllAndOverride(exports.MCP_SCOPES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]) ?? [];
        const request = context.switchToHttp().getRequest();
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
        throw new common_1.UnauthorizedException('Missing MCP credentials');
    }
    validateApiKey(apiKey, requiredScopes) {
        if (!this.apiKey) {
            throw new common_1.UnauthorizedException('MCP API key not configured');
        }
        if (!safeEqual(apiKey, this.apiKey)) {
            throw new common_1.UnauthorizedException('Invalid MCP API key');
        }
        const scopes = this.apiKeyScopes.length > 0 ? this.apiKeyScopes : mcp_constants_1.MCP_ALL_SCOPES;
        this.ensureScopes(scopes, requiredScopes);
    }
    validateJwt(token, requiredScopes) {
        if (!this.jwtSecret || !this.jwtService) {
            throw new common_1.UnauthorizedException('MCP JWT secret not configured');
        }
        try {
            const payload = this.jwtService.verify(token, { secret: this.jwtSecret });
            const scopes = this.extractScopes(payload);
            this.ensureScopes(scopes, requiredScopes);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid MCP JWT');
        }
    }
    ensureScopes(scopes, requiredScopes) {
        if (requiredScopes.length === 0) {
            return;
        }
        const missing = requiredScopes.filter((scope) => !scopes.includes(scope));
        if (missing.length > 0) {
            throw new common_1.UnauthorizedException('Missing MCP scope');
        }
    }
    extractScopes(payload) {
        if (!payload || typeof payload !== 'object') {
            return [];
        }
        const raw = payload;
        const scopeValue = raw.scope;
        const scopesValue = raw.scopes ?? raw.permissions;
        if (Array.isArray(scopesValue)) {
            return scopesValue.filter((entry) => typeof entry === 'string');
        }
        if (typeof scopeValue === 'string') {
            return this.parseScopes(scopeValue);
        }
        return [];
    }
    parseScopes(raw) {
        if (!raw) {
            return [];
        }
        return raw
            .split(/[,\s]+/)
            .map((scope) => scope.trim())
            .filter(Boolean);
    }
};
exports.McpGuard = McpGuard;
exports.McpGuard = McpGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], McpGuard);
function safeEqual(value, expected) {
    const valueBuf = Buffer.from(value);
    const expectedBuf = Buffer.from(expected);
    if (valueBuf.length !== expectedBuf.length) {
        return false;
    }
    return (0, crypto_1.timingSafeEqual)(valueBuf, expectedBuf);
}
function hashIdentifier(value) {
    return (0, crypto_1.createHash)('sha256').update(value).digest('hex');
}
//# sourceMappingURL=mcp.guard.js.map