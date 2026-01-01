import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { McpService } from './mcp.service';
import { PublishWeekMenuDto } from './dto/publish-week-menu.dto';
import { PublishWeekProverbDto } from './dto/publish-week-proverb.dto';
import { ClearWeekDataDto } from './dto/clear-week-data.dto';
import {
  MCP_SCOPE_MENU_WRITE,
  MCP_SCOPE_PROVERB_WRITE,
  MCP_SCOPE_WEEK_CLEAR,
} from './mcp.constants';
import { McpScopes } from './mcp.decorators';
import { McpGuard } from './guards/mcp.guard';
import { McpRateLimitGuard } from './guards/mcp-rate-limit.guard';

@Controller('mcp')
@UseGuards(McpGuard, McpRateLimitGuard)
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    forbidUnknownValues: true,
  }),
)
export class McpController {
  constructor(private readonly mcpService: McpService) {}

  @Put('week-menu')
  @McpScopes(MCP_SCOPE_MENU_WRITE)
  async publishWeekMenu(@Body() dto: PublishWeekMenuDto) {
    try {
      return await this.mcpService.publishWeekMenu(dto);
    } catch (error) {
      this.mcpService.logAudit('publish_week_menu', dto.weekStart, false);
      throw error;
    }
  }

  @Put('week-proverb')
  @McpScopes(MCP_SCOPE_PROVERB_WRITE)
  async publishWeekProverb(@Body() dto: PublishWeekProverbDto) {
    try {
      return await this.mcpService.publishWeekProverb(dto);
    } catch (error) {
      this.mcpService.logAudit('publish_week_proverb', dto.weekStart, false);
      throw error;
    }
  }

  @Post('clear-week')
  @McpScopes(MCP_SCOPE_WEEK_CLEAR)
  async clearWeekData(@Body() dto: ClearWeekDataDto) {
    try {
      return await this.mcpService.clearWeekData(dto);
    } catch (error) {
      const weekStart = dto.weekStart ?? 'unknown';
      this.mcpService.logAudit('clear_week_data', weekStart, false);
      throw error;
    }
  }

  @Get('health')
  @McpScopes(MCP_SCOPE_MENU_WRITE)
  health() {
    return { status: 'ok' };
  }
}
