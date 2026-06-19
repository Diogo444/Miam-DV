import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type { Response } from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { McpService } from './mcp.service';
import { McpServerFactory } from './mcp-server.factory';
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
import type { McpAuthenticatedRequest } from './guards/mcp.guard';
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
    private readonly mcpServerFactory: McpServerFactory,
  ) {}

  @Post()
  async handleMcpPost(@Req() request: McpAuthenticatedRequest, @Res() response: Response) {
    const server = this.mcpServerFactory.create(request.mcpAuth);
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(request, response, request.body);
    } catch (error) {
      if (!response.headersSent) {
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          jsonrpc: '2.0',
          error: {
            code: -32603,
            message: 'Internal server error',
          },
          id: null,
        });
      }
    } finally {
      const cleanup = () => {
        void transport.close();
        void server.close();
      };

      if (response.closed || response.writableEnded) {
        cleanup();
      } else {
        response.once('close', cleanup);
      }
    }
  }

  @Get()
  handleMcpGet(@Res() response: Response) {
    return this.methodNotAllowed(response);
  }

  @Delete()
  handleMcpDelete(@Res() response: Response) {
    return this.methodNotAllowed(response);
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
        message: 'Method not allowed. This MCP endpoint runs in stateless Streamable HTTP mode.',
      },
      id: null,
    });
  }
}
