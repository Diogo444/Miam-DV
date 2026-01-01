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
exports.McpController = void 0;
const common_1 = require("@nestjs/common");
const mcp_service_1 = require("./mcp.service");
const publish_week_menu_dto_1 = require("./dto/publish-week-menu.dto");
const publish_week_proverb_dto_1 = require("./dto/publish-week-proverb.dto");
const clear_week_data_dto_1 = require("./dto/clear-week-data.dto");
const mcp_constants_1 = require("./mcp.constants");
const mcp_decorators_1 = require("./mcp.decorators");
const mcp_guard_1 = require("./guards/mcp.guard");
const mcp_rate_limit_guard_1 = require("./guards/mcp-rate-limit.guard");
let McpController = class McpController {
    mcpService;
    constructor(mcpService) {
        this.mcpService = mcpService;
    }
    async publishWeekMenu(dto) {
        try {
            return await this.mcpService.publishWeekMenu(dto);
        }
        catch (error) {
            this.mcpService.logAudit('publish_week_menu', dto.weekStart, false);
            throw error;
        }
    }
    async publishWeekProverb(dto) {
        try {
            return await this.mcpService.publishWeekProverb(dto);
        }
        catch (error) {
            this.mcpService.logAudit('publish_week_proverb', dto.weekStart, false);
            throw error;
        }
    }
    async clearWeekData(dto) {
        try {
            return await this.mcpService.clearWeekData(dto);
        }
        catch (error) {
            const weekStart = dto.weekStart ?? 'unknown';
            this.mcpService.logAudit('clear_week_data', weekStart, false);
            throw error;
        }
    }
    health() {
        return { status: 'ok' };
    }
};
exports.McpController = McpController;
__decorate([
    (0, common_1.Put)('week-menu'),
    (0, mcp_decorators_1.McpScopes)(mcp_constants_1.MCP_SCOPE_MENU_WRITE),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [publish_week_menu_dto_1.PublishWeekMenuDto]),
    __metadata("design:returntype", Promise)
], McpController.prototype, "publishWeekMenu", null);
__decorate([
    (0, common_1.Put)('week-proverb'),
    (0, mcp_decorators_1.McpScopes)(mcp_constants_1.MCP_SCOPE_PROVERB_WRITE),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [publish_week_proverb_dto_1.PublishWeekProverbDto]),
    __metadata("design:returntype", Promise)
], McpController.prototype, "publishWeekProverb", null);
__decorate([
    (0, common_1.Post)('clear-week'),
    (0, mcp_decorators_1.McpScopes)(mcp_constants_1.MCP_SCOPE_WEEK_CLEAR),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [clear_week_data_dto_1.ClearWeekDataDto]),
    __metadata("design:returntype", Promise)
], McpController.prototype, "clearWeekData", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, mcp_decorators_1.McpScopes)(mcp_constants_1.MCP_SCOPE_MENU_WRITE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], McpController.prototype, "health", null);
exports.McpController = McpController = __decorate([
    (0, common_1.Controller)('mcp'),
    (0, common_1.UseGuards)(mcp_guard_1.McpGuard, mcp_rate_limit_guard_1.McpRateLimitGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        forbidUnknownValues: true,
    })),
    __metadata("design:paramtypes", [mcp_service_1.McpService])
], McpController);
//# sourceMappingURL=mcp.controller.js.map