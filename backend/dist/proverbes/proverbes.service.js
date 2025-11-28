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
const typeorm_1 = require("typeorm");
const proverbe_entity_1 = require("./entities/proverbe.entity");
const typeorm_2 = require("@nestjs/typeorm");
let ProverbesService = class ProverbesService {
    proverbesRepository;
    constructor(proverbesRepository) {
        this.proverbesRepository = proverbesRepository;
    }
    create(createProverbeDto) {
        const data = this.proverbesRepository.create(createProverbeDto);
        return this.proverbesRepository.save(data);
    }
    findAll() {
        return this.proverbesRepository.find();
    }
    findOne(id) {
        return this.proverbesRepository.findOneBy({ id });
    }
    update(id, updateProverbeDto) {
        return this.proverbesRepository.update(id, updateProverbeDto);
    }
    remove(id) {
        return this.proverbesRepository.delete(id);
    }
};
exports.ProverbesService = ProverbesService;
exports.ProverbesService = ProverbesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(proverbe_entity_1.Proverbe)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], ProverbesService);
//# sourceMappingURL=proverbes.service.js.map