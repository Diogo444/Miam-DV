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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const bcrypt = __importStar(require("bcrypt"));
let AdminService = class AdminService {
    adminRepository;
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }
    async create(createAdminDto) {
        const hash = await bcrypt.hash(createAdminDto.password, 10);
        const role = createAdminDto.role ?? 'admin';
        const admin = this.adminRepository.create({
            username: createAdminDto.username,
            password: hash,
            role,
        });
        const saved = await this.adminRepository.save(admin);
        return this.toSafeAdmin(saved);
    }
    async findAll() {
        return this.adminRepository.find({
            select: ['id', 'username', 'role'],
            order: { id: 'ASC' },
        });
    }
    async findOne(id) {
        return this.adminRepository.findOne({
            where: { id },
            select: ['id', 'username', 'role'],
        });
    }
    async findByUsername(username) {
        return this.adminRepository.findOne({
            where: { username },
            select: ['id', 'username', 'password', 'role'],
        });
    }
    async findById(id) {
        return this.adminRepository.findOne({
            where: { id },
            select: ['id', 'username', 'role'],
        });
    }
    async update(id, updateAdminDto) {
        const updatePayload = {};
        if (updateAdminDto.username !== undefined) {
            updatePayload.username = updateAdminDto.username;
        }
        if (updateAdminDto.role !== undefined) {
            updatePayload.role = updateAdminDto.role;
        }
        if (updateAdminDto.password) {
            updatePayload.password = await bcrypt.hash(updateAdminDto.password, 10);
        }
        if (!Object.keys(updatePayload).length) {
            return this.findOne(id);
        }
        await this.adminRepository.update({ id }, updatePayload);
        return this.findOne(id);
    }
    async remove(id) {
        await this.adminRepository.delete({ id });
        return { deleted: true };
    }
    toSafeAdmin(admin) {
        const { password, ...safeAdmin } = admin;
        return safeAdmin;
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map