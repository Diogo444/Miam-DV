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
exports.SuggestionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const suggestion_entity_1 = require("./entities/suggestion.entity");
const typeorm_2 = require("typeorm");
const proverbe_entity_1 = require("../proverbes/entities/proverbe.entity");
let SuggestionsService = class SuggestionsService {
    suggestionRepository;
    proverbeRepository;
    constructor(suggestionRepository, proverbeRepository) {
        this.suggestionRepository = suggestionRepository;
        this.proverbeRepository = proverbeRepository;
    }
    create(createSuggestionDto) {
        return this.suggestionRepository.save(createSuggestionDto);
    }
    findAll() {
        return this.suggestionRepository.find();
    }
    async accept(id) {
        const suggestion = await this.suggestionRepository.findOneBy({ id });
        if (!suggestion) {
            throw new common_1.NotFoundException(`Suggestion ${id} introuvable`);
        }
        const normalizedType = suggestion.type === 'Blague' ? 'blague' : 'proverbe';
        await this.proverbeRepository.clear();
        const newProverbe = this.proverbeRepository.create({
            id: 1,
            content: suggestion.content,
            type: normalizedType,
        });
        await this.proverbeRepository.save(newProverbe);
        await this.suggestionRepository.delete(id);
        return suggestion;
    }
    remove(id) {
        return this.suggestionRepository.delete(id);
    }
};
exports.SuggestionsService = SuggestionsService;
exports.SuggestionsService = SuggestionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(suggestion_entity_1.Suggestion)),
    __param(1, (0, typeorm_1.InjectRepository)(proverbe_entity_1.Proverbe)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SuggestionsService);
//# sourceMappingURL=suggestions.service.js.map