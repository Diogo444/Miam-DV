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
exports.MenusService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const menu_entity_1 = require("./entities/menu.entity");
const typeorm_2 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const proverbe_entity_1 = require("../proverbes/entities/proverbe.entity");
let MenusService = class MenusService {
    menuRepository;
    proverbeRepository;
    constructor(menuRepository, proverbeRepository) {
        this.menuRepository = menuRepository;
        this.proverbeRepository = proverbeRepository;
    }
    async create(createMenuDto) {
        const existingMenu = await this.menuRepository.findOneBy({
            jour: createMenuDto.jour,
            periode: createMenuDto.periode,
        });
        if (existingMenu) {
            return;
        }
        const menu = this.menuRepository.create(createMenuDto);
        return this.menuRepository.save(menu);
    }
    findAll() {
        return this.menuRepository.find();
    }
    async findOne(id) {
        const menu = await this.menuRepository.findOneBy({ id });
        if (!menu) {
            throw new common_1.NotFoundException(`Menu ${id} not found`);
        }
        return menu;
    }
    async update(id, updateMenuDto) {
        const menu = await this.menuRepository.preload({ id, ...updateMenuDto });
        if (!menu) {
            throw new common_1.NotFoundException(`Menu ${id} not found`);
        }
        return this.menuRepository.save(menu);
    }
    remove(id) {
        return this.menuRepository.delete(id);
    }
    async removeAll() {
        await this.menuRepository.clear();
        await this.proverbeRepository.clear();
        return { message: 'All menus and proverbes have been removed.' };
    }
};
exports.MenusService = MenusService;
__decorate([
    (0, schedule_1.Cron)('0 16 * * 5', {
        timeZone: 'Europe/Paris',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MenusService.prototype, "removeAll", null);
exports.MenusService = MenusService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(menu_entity_1.Menu)),
    __param(1, (0, typeorm_1.InjectRepository)(proverbe_entity_1.Proverbe)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], MenusService);
//# sourceMappingURL=menus.service.js.map