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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AdminSeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const admin_service_1 = require("./admin.service");
let AdminSeedService = AdminSeedService_1 = class AdminSeedService {
    adminService;
    users;
    logger = new common_1.Logger(AdminSeedService_1.name);
    constructor(adminService, users) {
        this.adminService = adminService;
        this.users = users;
    }
    async onApplicationBootstrap() {
        const existingUsers = await this.users.count();
        if (existingUsers > 0) {
            this.logger.debug('Default admin seed skipped (users already exist).');
            return;
        }
        const username = process.env.DEFAULT_ADMIN_USERNAME ?? 'admin';
        const password = process.env.DEFAULT_ADMIN_PASSWORD ?? 'admin';
        await this.adminService.create({ username, password, role: 'admin' });
        this.logger.warn(`Default admin created: ${username}`);
    }
};
exports.AdminSeedService = AdminSeedService;
exports.AdminSeedService = AdminSeedService = AdminSeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        typeorm_2.Repository])
], AdminSeedService);
//# sourceMappingURL=admin.seed.service.js.map