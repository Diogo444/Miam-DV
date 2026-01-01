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
exports.McpService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const week_menu_entity_1 = require("./entities/week-menu.entity");
const week_proverb_entity_1 = require("./entities/week-proverb.entity");
const menu_item_dto_1 = require("./dto/menu-item.dto");
const menu_entity_1 = require("../menus/entities/menu.entity");
const proverbe_entity_1 = require("../proverbes/entities/proverbe.entity");
let McpService = class McpService {
    weekMenuRepository;
    weekProverbRepository;
    menuRepository;
    proverbeRepository;
    logger = new common_1.Logger('McpAudit');
    constructor(weekMenuRepository, weekProverbRepository, menuRepository, proverbeRepository) {
        this.weekMenuRepository = weekMenuRepository;
        this.weekProverbRepository = weekProverbRepository;
        this.menuRepository = menuRepository;
        this.proverbeRepository = proverbeRepository;
    }
    async publishWeekMenu(dto) {
        const weekStart = this.assertValidWeekStart(dto.weekStart);
        const items = this.normalizeWeekMenuItems(dto.items);
        this.ensureUniqueDays(items);
        const existing = await this.weekMenuRepository.findOne({
            where: { weekStart },
        });
        if (existing) {
            existing.items = items;
            existing.notes = dto.notes ?? null;
            await this.weekMenuRepository.save(existing);
        }
        else {
            const created = this.weekMenuRepository.create({
                weekStart,
                items,
                notes: dto.notes ?? null,
            });
            await this.weekMenuRepository.save(created);
        }
        await this.replaceLegacyMenus(items);
        this.logAudit('publish_week_menu', weekStart, true);
        return { success: true, weekStart };
    }
    async publishWeekProverb(dto) {
        const weekStart = this.assertValidWeekStart(dto.weekStart);
        const existing = await this.weekProverbRepository.findOne({
            where: { weekStart },
        });
        if (existing) {
            existing.text = dto.text;
            existing.author = dto.author ?? null;
            existing.source = dto.source ?? null;
            await this.weekProverbRepository.save(existing);
        }
        else {
            const created = this.weekProverbRepository.create({
                weekStart,
                text: dto.text,
                author: dto.author ?? null,
                source: dto.source ?? null,
            });
            await this.weekProverbRepository.save(created);
        }
        await this.replaceLegacyProverbe(dto.type ?? 'proverbe', dto.text);
        this.logAudit('publish_week_proverb', weekStart, true);
        return { success: true, weekStart };
    }
    async clearWeekData(dto) {
        const weekStart = this.resolveWeekStart(dto);
        await this.weekMenuRepository.delete({ weekStart });
        await this.weekProverbRepository.delete({ weekStart });
        await this.menuRepository.clear();
        await this.proverbeRepository.clear();
        this.logAudit('clear_week_data', weekStart, true);
        return { success: true, weekStart };
    }
    logAudit(tool, weekStart, success) {
        this.logger.log(`tool=${tool} weekStart=${weekStart} status=${success ? 'success' : 'failure'}`);
    }
    normalizeWeekMenuItems(items) {
        return items.map((item) => {
            const day = (0, menu_item_dto_1.normalizeWeekday)(item.day);
            if (!day) {
                throw new common_1.BadRequestException(`Invalid day value: ${item.day}`);
            }
            const lunch = coerceMealList(item.lunch ?? item.midi ?? item.main);
            const dinner = coerceMealList(item.dinner ?? item.soir ?? item.starter);
            if (!lunch && !dinner) {
                throw new common_1.BadRequestException(`Each menu item must include lunch/main or dinner/starter for ${day}`);
            }
            const normalized = { day };
            if (lunch?.length) {
                normalized.lunch = lunch;
                normalized.main = item.main ?? joinMealList(lunch);
            }
            else if (item.main) {
                normalized.main = item.main;
            }
            if (dinner?.length) {
                normalized.dinner = dinner;
                normalized.starter = item.starter ?? joinMealList(dinner);
            }
            else if (item.starter) {
                normalized.starter = item.starter;
            }
            if (item.dessert) {
                normalized.dessert = item.dessert;
            }
            if (item.allergens?.length) {
                normalized.allergens = item.allergens;
            }
            return normalized;
        });
    }
    async replaceLegacyMenus(items) {
        await this.menuRepository.clear();
        const menus = items.flatMap((item) => {
            const jour = LEGACY_DAY_LABELS[item.day] ?? item.day;
            const legacyMenus = [];
            if (item.lunch?.length) {
                const fields = mapMealToLegacyFields(item.lunch, item.dessert);
                legacyMenus.push(this.menuRepository.create({
                    jour,
                    periode: 'Déjeuner',
                    ...fields,
                }));
            }
            if (item.dinner?.length) {
                const fields = mapMealToLegacyFields(item.dinner);
                legacyMenus.push(this.menuRepository.create({
                    jour,
                    periode: 'Dîner',
                    ...fields,
                }));
            }
            return legacyMenus;
        });
        if (menus.length > 0) {
            await this.menuRepository.save(menus);
        }
    }
    async replaceLegacyProverbe(type, content) {
        await this.proverbeRepository.clear();
        const proverbe = this.proverbeRepository.create({ id: 1, type, content });
        await this.proverbeRepository.save(proverbe);
    }
    ensureUniqueDays(items) {
        const seen = new Set();
        for (const item of items) {
            if (seen.has(item.day)) {
                throw new common_1.BadRequestException('Duplicate day entries are not allowed');
            }
            seen.add(item.day);
        }
    }
    resolveWeekStart(dto) {
        if (dto.weekStart && dto.scope) {
            throw new common_1.BadRequestException('Provide weekStart or scope, not both');
        }
        if (dto.weekStart) {
            return this.assertValidWeekStart(dto.weekStart);
        }
        if (dto.scope === 'currentWeek') {
            return getCurrentWeekStart();
        }
        throw new common_1.BadRequestException('weekStart or scope is required');
    }
    assertValidWeekStart(weekStart) {
        const date = parseLocalDate(weekStart);
        if (!date) {
            throw new common_1.BadRequestException('weekStart must be a valid YYYY-MM-DD date');
        }
        if (date.getDay() !== 1) {
            throw new common_1.BadRequestException('weekStart must be a Monday');
        }
        return weekStart;
    }
};
exports.McpService = McpService;
exports.McpService = McpService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(week_menu_entity_1.WeekMenu)),
    __param(1, (0, typeorm_1.InjectRepository)(week_proverb_entity_1.WeekProverb)),
    __param(2, (0, typeorm_1.InjectRepository)(menu_entity_1.Menu)),
    __param(3, (0, typeorm_1.InjectRepository)(proverbe_entity_1.Proverbe)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], McpService);
const LEGACY_DAY_LABELS = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
};
function mapMealToLegacyFields(dishes, dessertOverride) {
    const cleaned = dishes.map((dish) => dish.trim()).filter(Boolean);
    const override = dessertOverride?.trim();
    if (cleaned.length === 0) {
        return { entree: '', plat: '', fromage: '', dessert: override ?? '' };
    }
    if (cleaned.length === 1) {
        return { entree: '', plat: cleaned[0], fromage: '', dessert: override ?? '' };
    }
    if (cleaned.length === 2) {
        return {
            entree: cleaned[0],
            plat: cleaned[1],
            fromage: '',
            dessert: override ?? '',
        };
    }
    if (cleaned.length === 3) {
        return {
            entree: cleaned[0],
            plat: cleaned[1],
            fromage: override ? cleaned[2] : '',
            dessert: override ?? cleaned[2],
        };
    }
    const entree = cleaned[0];
    const platParts = cleaned.length >= 5 ? [cleaned[1], cleaned[2]] : [cleaned[1]];
    const fromage = cleaned[cleaned.length - 2] ?? '';
    const dessert = override ?? cleaned[cleaned.length - 1] ?? '';
    return {
        entree,
        plat: platParts.filter(Boolean).join(' - '),
        fromage,
        dessert,
    };
}
function coerceMealList(value) {
    if (!value) {
        return undefined;
    }
    if (Array.isArray(value)) {
        const cleaned = value.map((entry) => entry.trim()).filter(Boolean);
        return cleaned.length > 0 ? cleaned : undefined;
    }
    if (typeof value === 'string') {
        const cleaned = splitMealText(value);
        return cleaned.length > 0 ? cleaned : undefined;
    }
    return undefined;
}
function splitMealText(value) {
    return value
        .split(/\r?\n|;/g)
        .map((entry) => entry.replace(/^[-\s]+/, '').trim())
        .map((entry) => entry.replace(/^(midi|soir)\s*:?\s*/i, '').trim())
        .filter(Boolean);
}
function joinMealList(items) {
    return items.join('; ');
}
function parseLocalDate(value) {
    const parts = value.split('-').map((part) => Number(part));
    if (parts.length !== 3) {
        return null;
    }
    const [year, month, day] = parts;
    if (!year || !month || !day) {
        return null;
    }
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day) {
        return null;
    }
    return date;
}
function getCurrentWeekStart() {
    const now = new Date();
    const day = now.getDay();
    const diff = (day + 6) % 7;
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diff);
    return formatLocalDate(monday);
}
function formatLocalDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
//# sourceMappingURL=mcp.service.js.map