import type { Response } from 'express';
import { McpService } from './mcp.service';
import { PublishWeekMenuDto } from './dto/publish-week-menu.dto';
import { PublishWeekProverbDto } from './dto/publish-week-proverb.dto';
import { ClearWeekDataDto } from './dto/clear-week-data.dto';
import { DeleteWeekMenuDto, DeleteWeekMessageDto } from './dto/delete-week-data.dto';
export declare class McpController {
    private readonly mcpService;
    constructor(mcpService: McpService);
    handleMcpPost(response: Response): Response<any, Record<string, any>>;
    handleMcpGet(response: Response): Response<any, Record<string, any>>;
    handleMcpDelete(response: Response): Response<any, Record<string, any>>;
    listWeeks(): Promise<{
        weekStart: string;
        hasMenu: boolean;
        hasMessage: boolean;
        updatedAt: Date;
    }[]>;
    getWeekData(weekStart?: string): Promise<{
        weekStart: string;
        menu: {
            items: unknown;
            notes: string | null;
            updatedAt: Date;
        } | null;
        proverb: {
            text: string;
            type: "blague" | "proverbe";
            author: string | null;
            source: string | null;
            updatedAt: Date;
        } | null;
    }>;
    publishWeekMenu(dto: PublishWeekMenuDto): Promise<{
        success: boolean;
        weekStart: string;
    }>;
    publishWeekProverb(dto: PublishWeekProverbDto): Promise<{
        success: boolean;
        weekStart: string;
    }>;
    publishWeekMessage(dto: PublishWeekProverbDto): Promise<{
        success: boolean;
        weekStart: string;
    }>;
    deleteWeekMenu(dto: DeleteWeekMenuDto): Promise<{
        success: boolean;
        weekStart: string;
        deleted: boolean;
    }>;
    deleteWeekMessage(dto: DeleteWeekMessageDto): Promise<{
        success: boolean;
        weekStart: string;
        deleted: boolean;
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
