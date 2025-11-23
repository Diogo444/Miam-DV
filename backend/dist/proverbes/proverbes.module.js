"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProverbesModule = void 0;
const common_1 = require("@nestjs/common");
const proverbes_service_1 = require("./proverbes.service");
const proverbes_controller_1 = require("./proverbes.controller");
const typeorm_1 = require("@nestjs/typeorm");
const proverbe_entity_1 = require("./entities/proverbe.entity");
let ProverbesModule = class ProverbesModule {
};
exports.ProverbesModule = ProverbesModule;
exports.ProverbesModule = ProverbesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([proverbe_entity_1.Proverbe])],
        controllers: [proverbes_controller_1.ProverbesController],
        providers: [proverbes_service_1.ProverbesService],
    })
], ProverbesModule);
//# sourceMappingURL=proverbes.module.js.map