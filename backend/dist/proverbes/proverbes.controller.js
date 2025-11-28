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
exports.ProverbesController = void 0;
const common_1 = require("@nestjs/common");
const proverbes_service_1 = require("./proverbes.service");
const create_proverbe_dto_1 = require("./dto/create-proverbe.dto");
const update_proverbe_dto_1 = require("./dto/update-proverbe.dto");
let ProverbesController = class ProverbesController {
    proverbesService;
    constructor(proverbesService) {
        this.proverbesService = proverbesService;
    }
    createOrReplace(dto) {
        return this.proverbesService.createOrReplace(dto);
    }
    update(dto) {
        return this.proverbesService.update(dto);
    }
    findOne() {
        return this.proverbesService.findOne();
    }
    remove() {
        return this.proverbesService.remove();
    }
};
exports.ProverbesController = ProverbesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_proverbe_dto_1.CreateProverbeDto]),
    __metadata("design:returntype", void 0)
], ProverbesController.prototype, "createOrReplace", null);
__decorate([
    (0, common_1.Patch)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_proverbe_dto_1.UpdateProverbeDto]),
    __metadata("design:returntype", void 0)
], ProverbesController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProverbesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProverbesController.prototype, "remove", null);
exports.ProverbesController = ProverbesController = __decorate([
    (0, common_1.Controller)('api/proverbes'),
    __metadata("design:paramtypes", [proverbes_service_1.ProverbesService])
], ProverbesController);
//# sourceMappingURL=proverbes.controller.js.map