"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
require("dotenv/config");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const users_module_1 = require("../users/users.module");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const local_strategy_1 = require("./strategies/local.strategy");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const auth_guard_1 = require("../common/guards/auth/auth.guard");
const roles_guard_1 = require("../common/guards/auth/roles.guard");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            (() => {
                const secret = process.env.JWT_SECRET;
                if (!secret) {
                    throw new Error('JWT_SECRET must be defined');
                }
                const maskedSecret = secret.length > 8 ? `${secret.slice(0, 4)}...${secret.slice(-4)}` : secret;
                common_1.Logger.debug(`AuthModule -> configuring JwtModule with secret length=${secret.length}, masked=${maskedSecret}`);
                return jwt_1.JwtModule.register({
                    secret,
                    signOptions: {
                        expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
                    },
                });
            })(),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, local_strategy_1.LocalStrategy, jwt_strategy_1.JwtStrategy, auth_guard_1.LocalAuthGuard, auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard],
        exports: [auth_service_1.AuthService, auth_guard_1.LocalAuthGuard, auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map