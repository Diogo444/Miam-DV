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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProverbesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const proverbe_entity_1 = require("./entities/proverbe.entity");
let ProverbesService = class ProverbesService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async createOrReplace(dto) {
        const normalizedType = normalizeProverbeType(dto.type);
        if (!normalizedType) {
            throw new common_1.BadRequestException("type must be 'blague' or 'proverbe'");
        }
        const existing = await this.repo.findOne({ where: { id: 1 } });
        if (existing) {
            await this.repo.update(1, { ...dto, type: normalizedType });
            const proverbe = await this.repo.findOneBy({ id: 1 });
            return {
                message: 'Proverbe mis à jour avec succès.',
                proverbe,
            };
        }
        const data = this.repo.create({ ...dto, id: 1, type: normalizedType });
        const proverbe = await this.repo.save(data);
        return {
            message: 'Proverbe ajouté avec succès.',
            proverbe,
        };
    }
    findOne() {
        return this.repo.findOneBy({ id: 1 });
    }
    async update(dto) {
        const normalizedType = dto.type ? normalizeProverbeType(dto.type) : undefined;
        if (dto.type && !normalizedType) {
            throw new common_1.BadRequestException("type must be 'blague' or 'proverbe'");
        }
        await this.repo.update(1, { ...dto, ...(normalizedType ? { type: normalizedType } : {}) });
        return this.repo.findOneBy({ id: 1 });
    }
    async remove() {
        const proverbe = await this.repo.findOneBy({ id: 1 });
        if (!proverbe) {
            return null;
        }
        await this.repo.remove(proverbe);
        return proverbe;
    }
};
exports.ProverbesService = ProverbesService;
exports.ProverbesService = ProverbesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(proverbe_entity_1.Proverbe)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProverbesService);
function normalizeProverbeType(type) {
    if (typeof type !== 'string') {
        return null;
    }
    const normalized = type.trim().toLowerCase();
    if (normalized === 'blague' || normalized === 'proverbe') {
        return normalized;
    }
    if (normalized === 'joke') {
        return 'blague';
    }
    if (normalized === 'proverb') {
        return 'proverbe';
    }
    return null;
}
//# sourceMappingURL=proverbes.service.js.map