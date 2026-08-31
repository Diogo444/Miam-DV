import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type { Response } from 'express';
import { McpService } from './mcp.service';
import { PublishWeekMenuDto } from './dto/publish-week-menu.dto';
import { PublishWeekProverbDto } from './dto/publish-week-proverb.dto';
import { ClearWeekDataDto } from './dto/clear-week-data.dto';
import {
  DeleteWeekMenuDto,
  DeleteWeekMessageDto,
} from './dto/delete-week-data.dto';
import {
  MCP_SCOPE_MENU_DELETE,
  MCP_SCOPE_MENU_WRITE,
  MCP_SCOPE_PROVERB_DELETE,
  MCP_SCOPE_PROVERB_WRITE,
  MCP_SCOPE_WEEK_CLEAR,
  MCP_SCOPE_WEEK_READ,
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
  constructor(
    private readonly mcpService: McpService,
  ) {}

  @Post()
  handleMcpPost(@Res() response: Response) {
    return this.methodNotAllowed(response);
  }

  @Get()
  handleMcpGet(@Res() response: Response) {
    return this.methodNotAllowed(response);
  }

  @Delete()
  handleMcpDelete(@Res() response: Response) {
    return this.methodNotAllowed(response);
  }

  @Get('weeks')
  @McpScopes(MCP_SCOPE_WEEK_READ)
  listWeeks() {
    return this.mcpService.listWeeks();
  }

  @Get('week-data')
  @McpScopes(MCP_SCOPE_WEEK_READ)
  getWeekData(@Query('weekStart') weekStart?: string) {
    return this.mcpService.getWeekData(weekStart);
  }

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

  @Put('week-message')
  @McpScopes(MCP_SCOPE_PROVERB_WRITE)
  publishWeekMessage(@Body() dto: PublishWeekProverbDto) {
    return this.publishWeekProverb(dto);
  }

  @Delete('week-menu')
  @McpScopes(MCP_SCOPE_MENU_DELETE)
  async deleteWeekMenu(@Body() dto: DeleteWeekMenuDto) {
    try {
      return await this.mcpService.deleteWeekMenu(dto.weekStart);
    } catch (error) {
      this.mcpService.logAudit('delete_week_menu', dto.weekStart, false);
      throw error;
    }
  }

  @Delete('week-message')
  @McpScopes(MCP_SCOPE_PROVERB_DELETE)
  async deleteWeekMessage(@Body() dto: DeleteWeekMessageDto) {
    try {
      return await this.mcpService.deleteWeekMessage(dto.weekStart);
    } catch (error) {
      this.mcpService.logAudit('delete_week_message', dto.weekStart, false);
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
  health() {
    return { status: 'ok' };
  }

  private methodNotAllowed(response: Response) {
    response.setHeader('Allow', 'POST');
    return response.status(HttpStatus.METHOD_NOT_ALLOWED).json({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message:
          'Method not allowed. The backend exposes an internal data contract only; connect MCP clients to the mcp-server facade.',
      },
      id: null,
    });
  }
}
