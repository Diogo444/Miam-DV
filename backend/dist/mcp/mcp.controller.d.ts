import type { Response } from 'express';
import { McpService } from './mcp.service';
import { McpServerFactory } from './mcp-server.factory';
import { PublishWeekMenuDto } from './dto/publish-week-menu.dto';
import { PublishWeekProverbDto } from './dto/publish-week-proverb.dto';
import { ClearWeekDataDto } from './dto/clear-week-data.dto';
import type { McpAuthenticatedRequest } from './guards/mcp.guard';
export declare class McpController {
    private readonly mcpService;
    private readonly mcpServerFactory;
    constructor(mcpService: McpService, mcpServerFactory: McpServerFactory);
    handleMcpPost(request: McpAuthenticatedRequest, response: Response): Promise<void>;
    handleMcpGet(response: Response): Response<any, Record<string, any>>;
    handleMcpDelete(response: Response): Response<any, Record<string, any>>;
    publishWeekMenu(dto: PublishWeekMenuDto): Promise<{
        success: boolean;
        weekStart: string;
    }>;
    publishWeekProverb(dto: PublishWeekProverbDto): Promise<{
        success: boolean;
        weekStart: string;
    }>;
    clearWeekData(dto: ClearWeekDataDto): Promise<{
        success: boolean;
        weekStart: string;
    }>;
    health(): {
        status: string;
    };
    private methodNotAllowed;
}
