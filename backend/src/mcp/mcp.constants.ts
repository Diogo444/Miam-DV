export const MCP_SCOPE_MENU_WRITE = 'mcp:menu:write';
export const MCP_SCOPE_PROVERB_WRITE = 'mcp:proverb:write';
export const MCP_SCOPE_WEEK_CLEAR = 'mcp:week:clear';

export type McpScope =
  | typeof MCP_SCOPE_MENU_WRITE
  | typeof MCP_SCOPE_PROVERB_WRITE
  | typeof MCP_SCOPE_WEEK_CLEAR;

export const MCP_ALL_SCOPES: McpScope[] = [
  MCP_SCOPE_MENU_WRITE,
  MCP_SCOPE_PROVERB_WRITE,
  MCP_SCOPE_WEEK_CLEAR,
];
