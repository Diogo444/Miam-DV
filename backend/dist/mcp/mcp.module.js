"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const mcp_controller_1 = require("./mcp.controller");
const mcp_service_1 = require("./mcp.service");
const week_menu_entity_1 = require("./entities/week-menu.entity");
const week_proverb_entity_1 = require("./entities/week-proverb.entity");
const mcp_guard_1 = require("./guards/mcp.guard");
const mcp_rate_limit_guard_1 = require("./guards/mcp-rate-limit.guard");
const menu_entity_1 = require("../menus/entities/menu.entity");
const proverbe_entity_1 = require("../proverbes/entities/proverbe.entity");
let McpModule = class McpModule {
};
exports.McpModule = McpModule;
exports.McpModule = McpModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([week_menu_entity_1.WeekMenu, week_proverb_entity_1.WeekProverb, menu_entity_1.Menu, proverbe_entity_1.Proverbe])],
        controllers: [mcp_controller_1.McpController],
        providers: [mcp_service_1.McpService, mcp_guard_1.McpGuard, mcp_rate_limit_guard_1.McpRateLimitGuard],
    })
], McpModule);
//# sourceMappingURL=mcp.module.js.map