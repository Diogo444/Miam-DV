"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpScopes = void 0;
const common_1 = require("@nestjs/common");
const mcp_guard_1 = require("./guards/mcp.guard");
const McpScopes = (...scopes) => (0, common_1.SetMetadata)(mcp_guard_1.MCP_SCOPES_KEY, scopes);
exports.McpScopes = McpScopes;
//# sourceMappingURL=mcp.decorators.js.map