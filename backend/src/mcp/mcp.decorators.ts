import { SetMetadata } from '@nestjs/common';
import { McpScope } from './mcp.constants';
import { MCP_SCOPES_KEY } from './guards/mcp.guard';

export const McpScopes = (...scopes: McpScope[]) =>
  SetMetadata(MCP_SCOPES_KEY, scopes);
