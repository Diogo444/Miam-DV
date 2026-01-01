import { McpService } from './mcp.service';
import { PublishWeekMenuDto } from './dto/publish-week-menu.dto';
import { PublishWeekProverbDto } from './dto/publish-week-proverb.dto';
import { ClearWeekDataDto } from './dto/clear-week-data.dto';
export declare class McpController {
    private readonly mcpService;
    constructor(mcpService: McpService);
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
}
