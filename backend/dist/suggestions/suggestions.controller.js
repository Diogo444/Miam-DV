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
exports.SuggestionsController = void 0;
const common_1 = require("@nestjs/common");
const suggestions_service_1 = require("./suggestions.service");
const create_suggestion_dto_1 = require("./dto/create-suggestion.dto");
const passport_1 = require("@nestjs/passport");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let SuggestionsController = class SuggestionsController {
    suggestionsService;
    constructor(suggestionsService) {
        this.suggestionsService = suggestionsService;
    }
    create(createSuggestionDto) {
        return this.suggestionsService.create(createSuggestionDto);
    }
    findAll() {
        return this.suggestionsService.findAll();
    }
    accept(id) {
        return this.suggestionsService.accept(+id);
    }
    remove(id) {
        return this.suggestionsService.remove(+id);
    }
};
exports.SuggestionsController = SuggestionsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_suggestion_dto_1.CreateSuggestionDto]),
    __metadata("design:returntype", void 0)
], SuggestionsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SuggestionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('accept/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SuggestionsController.prototype, "accept", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SuggestionsController.prototype, "remove", null);
exports.SuggestionsController = SuggestionsController = __decorate([
    (0, common_1.Controller)('api/suggestions'),
    __metadata("design:paramtypes", [suggestions_service_1.SuggestionsService])
], SuggestionsController);
//# sourceMappingURL=suggestions.controller.js.map