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
const streamableHttp_js_1 = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
const mcp_service_1 = require("./mcp.service");
const mcp_server_factory_1 = require("./mcp-server.factory");
const publish_week_menu_dto_1 = require("./dto/publish-week-menu.dto");
const publish_week_proverb_dto_1 = require("./dto/publish-week-proverb.dto");
const clear_week_data_dto_1 = require("./dto/clear-week-data.dto");
const mcp_constants_1 = require("./mcp.constants");
const mcp_decorators_1 = require("./mcp.decorators");
const mcp_guard_1 = require("./guards/mcp.guard");
const mcp_rate_limit_guard_1 = require("./guards/mcp-rate-limit.guard");
let McpController = class McpController {
    mcpService;
    mcpServerFactory;
    constructor(mcpService, mcpServerFactory) {
        this.mcpService = mcpService;
        this.mcpServerFactory = mcpServerFactory;
    }
    async handleMcpPost(request, response) {
        const server = this.mcpServerFactory.create(request.mcpAuth);
        const transport = new streamableHttp_js_1.StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
        });
        try {
            await server.connect(transport);
            await transport.handleRequest(request, response, request.body);
        }
        catch {
            if (!response.headersSent) {
                response.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                    jsonrpc: '2.0',
                    error: {
                        code: -32603,
                        message: 'Internal server error',
                    },
                    id: null,
                });
            }
        }
        finally {
            const cleanup = () => {
                void transport.close();
                void server.close();
            };
            if (response.closed || response.writableEnded) {
                cleanup();
            }
            else {
                response.once('close', cleanup);
            }
        }
    }
    handleMcpGet(response) {
        return this.methodNotAllowed(response);
    }
    handleMcpDelete(response) {
        return this.methodNotAllowed(response);
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
    methodNotAllowed(response) {
        response.setHeader('Allow', 'POST');
        return response.status(common_1.HttpStatus.METHOD_NOT_ALLOWED).json({
            jsonrpc: '2.0',
            error: {
                code: -32000,
                message: 'Method not allowed. This MCP endpoint runs in stateless Streamable HTTP mode.',
            },
            id: null,
        });
    }
};
exports.McpController = McpController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], McpController.prototype, "handleMcpPost", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], McpController.prototype, "handleMcpGet", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], McpController.prototype, "handleMcpDelete", null);
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
    __metadata("design:paramtypes", [mcp_service_1.McpService,
        mcp_server_factory_1.McpServerFactory])
], McpController);
//# sourceMappingURL=mcp.controller.js.map