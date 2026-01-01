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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuItemDto = exports.WEEKDAY_ALIASES = exports.Weekday = void 0;
exports.normalizeWeekday = normalizeWeekday;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var Weekday;
(function (Weekday) {
    Weekday["Monday"] = "monday";
    Weekday["Tuesday"] = "tuesday";
    Weekday["Wednesday"] = "wednesday";
    Weekday["Thursday"] = "thursday";
    Weekday["Friday"] = "friday";
})(Weekday || (exports.Weekday = Weekday = {}));
exports.WEEKDAY_ALIASES = {
    monday: Weekday.Monday,
    lundi: Weekday.Monday,
    tuesday: Weekday.Tuesday,
    mardi: Weekday.Tuesday,
    wednesday: Weekday.Wednesday,
    mercredi: Weekday.Wednesday,
    thursday: Weekday.Thursday,
    jeudi: Weekday.Thursday,
    friday: Weekday.Friday,
    vendredi: Weekday.Friday,
};
const WEEKDAY_VALUES = Object.keys(exports.WEEKDAY_ALIASES);
function normalizeDayInput(value) {
    if (typeof value !== 'string') {
        return value;
    }
    return value.trim().toLowerCase();
}
function splitMealText(value) {
    return value
        .split(/\r?\n|;/g)
        .map((entry) => entry.replace(/^[-\s]+/, '').trim())
        .map((entry) => entry.replace(/^(midi|soir)\s*:?\s*/i, '').trim())
        .filter(Boolean);
}
function normalizeMealListInput(value) {
    if (value === null || value === undefined) {
        return value;
    }
    if (Array.isArray(value)) {
        return value
            .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
            .filter(Boolean);
    }
    if (typeof value === 'string') {
        return splitMealText(value);
    }
    return value;
}
function normalizeWeekday(value) {
    return exports.WEEKDAY_ALIASES[value.trim().toLowerCase()] ?? null;
}
class MenuItemDto {
    day;
    main;
    starter;
    dessert;
    lunch;
    dinner;
    midi;
    soir;
    allergens;
}
exports.MenuItemDto = MenuItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => normalizeDayInput(value)),
    (0, class_validator_1.IsIn)(WEEKDAY_VALUES),
    __metadata("design:type", String)
], MenuItemDto.prototype, "day", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(800),
    __metadata("design:type", String)
], MenuItemDto.prototype, "main", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(800),
    __metadata("design:type", String)
], MenuItemDto.prototype, "starter", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(800),
    __metadata("design:type", String)
], MenuItemDto.prototype, "dessert", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => normalizeMealListInput(value)),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(12),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.MinLength)(1, { each: true }),
    (0, class_validator_1.MaxLength)(200, { each: true }),
    __metadata("design:type", Array)
], MenuItemDto.prototype, "lunch", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => normalizeMealListInput(value)),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(12),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.MinLength)(1, { each: true }),
    (0, class_validator_1.MaxLength)(200, { each: true }),
    __metadata("design:type", Array)
], MenuItemDto.prototype, "dinner", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => normalizeMealListInput(value)),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(12),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.MinLength)(1, { each: true }),
    (0, class_validator_1.MaxLength)(200, { each: true }),
    __metadata("design:type", Array)
], MenuItemDto.prototype, "midi", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => normalizeMealListInput(value)),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(12),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.MinLength)(1, { each: true }),
    (0, class_validator_1.MaxLength)(200, { each: true }),
    __metadata("design:type", Array)
], MenuItemDto.prototype, "soir", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(30),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.MaxLength)(80, { each: true }),
    __metadata("design:type", Array)
], MenuItemDto.prototype, "allergens", void 0);
//# sourceMappingURL=menu-item.dto.js.map