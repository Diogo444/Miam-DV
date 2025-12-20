"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("../admin/admin.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = AuthService_1 = class AuthService {
    admins;
    jwt;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(admins, jwt) {
        this.admins = admins;
        this.jwt = jwt;
    }
    async validateUser(username, password) {
        const user = await this.admins.findByUsername(username);
        if (!user)
            return null;
        const match = await bcrypt.compare(password, user.password);
        return match ? this.toSafeUser(user) : null;
    }
    async register(payload) {
        const existing = await this.admins.findByUsername(payload.username);
        if (existing) {
            throw new common_1.ConflictException('Username already exists');
        }
        const user = await this.admins.create(payload);
        return this.buildAuthResponse(user);
    }
    async login(user) {
        return this.buildAuthResponse(user);
    }
    async me(user) {
        const freshUser = await this.admins.findById(user.id);
        if (!freshUser) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return { user: this.toSafeUser(freshUser) };
    }
    buildAuthResponse(user) {
        const payload = { sub: user.id, role: user.role };
        const token = this.jwt.sign(payload);
        const maskedToken = token.length > 14 ? `${token.slice(0, 6)}...${token.slice(-4)}` : token;
        const secret = process.env.JWT_SECRET;
        const maskedSecret = secret && secret.length > 8
            ? `${secret.slice(0, 4)}...${secret.slice(-4)}`
            : secret ?? 'undefined';
        this.logger.debug(`AuthService.buildAuthResponse -> token length=${token.length}, masked=${maskedToken}, payload sub=${payload.sub}, role=${payload.role}, secret length=${secret?.length ?? 0}, masked=${maskedSecret}`);
        return {
            access_token: token,
            user: this.toSafeUser(user),
        };
    }
    toSafeUser(user) {
        const { password, ...safeUser } = user;
        return safeUser;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [admin_service_1.AdminService, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map