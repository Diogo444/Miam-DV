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
var JwtStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const admin_service_1 = require("../../admin/admin.service");
let JwtStrategy = JwtStrategy_1 = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    adminService;
    logger = new common_1.Logger(JwtStrategy_1.name);
    constructor(adminService) {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET must be defined');
        }
        const maskedSecret = secret.length > 8 ? `${secret.slice(0, 4)}...${secret.slice(-4)}` : secret;
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret,
        });
        this.adminService = adminService;
        this.logger.debug(`JwtStrategy init: using secret length=${secret.length}, masked=${maskedSecret}`);
    }
    async validate(payload) {
        this.logger.debug(`validate() called with payload sub=${payload?.sub}, role=${payload?.role}, exp=${payload?.exp}`);
        const user = await this.adminService.findById(payload.sub);
        if (!user) {
            this.logger.warn(`User not found for sub=${payload?.sub}`);
            throw new common_1.UnauthorizedException('User not found');
        }
        const currentVersion = user.tokenVersion ?? 0;
        const payloadVersion = typeof payload?.tokenVersion === 'number'
            ? payload.tokenVersion
            : Number(payload?.tokenVersion);
        if (!Number.isFinite(payloadVersion) || payloadVersion !== currentVersion) {
            this.logger.warn(`Token version mismatch for sub=${payload?.sub}: token=${payloadVersion}, db=${currentVersion}`);
            throw new common_1.UnauthorizedException('Token revoked');
        }
        this.logger.debug(`User resolved for sub=${payload?.sub}: username=${user.username}, role=${user.role}`);
        return {
            id: user.id,
            username: user.username,
            role: user.role,
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = JwtStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map