import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { CallToolResultSchema, GetPromptResultSchema, ListPromptsResultSchema, ListResourcesResultSchema, ListToolsResultSchema, ReadResourceResultSchema, } from '@modelcontextprotocol/sdk/types.js';
const serverUrl = process.env.MCP_SERVER_URL ?? 'http://localhost:4310/mcp';
const authToken = process.env.MCP_SERVER_AUTH_TOKEN;
const writeVerification = process.env.MCP_VERIFY_WRITE === 'true';
const verificationWeekStart = process.env.MCP_VERIFY_WEEK_START;
async function main() {
    const client = new Client({ name: 'miam-dv-mcp-verify', version: '2.0.0' });
    const transport = new StreamableHTTPClientTransport(new URL(serverUrl), {
        requestInit: authToken ? { headers: { Authorization: `Bearer ${authToken}` } } : undefined,
    });
    await client.connect(transport);
    await client.ping();
    const tools = await client.request({ method: 'tools/list', params: {} }, ListToolsResultSchema);
    assertTools(tools.tools.map((tool) => tool.name));
    const resources = await client.request({ method: 'resources/list', params: {} }, ListResourcesResultSchema);
    assert(resources.resources.some((resource) => resource.uri === 'miam-dv://weeks/current'), 'Missing current-week resource');
    await client.request({ method: 'resources/read', params: { uri: 'miam-dv://weeks/current' } }, ReadResourceResultSchema);
    const prompts = await client.request({ method: 'prompts/list', params: {} }, ListPromptsResultSchema);
    assert(prompts.prompts.some((prompt) => prompt.name === 'prepare_week_menu'), 'Missing prepare_week_menu prompt');
    const weekStart = verificationWeekStart ?? nextMonday();
    await client.request({ method: 'prompts/get', params: { name: 'prepare_week_menu', arguments: { weekStart } } }, GetPromptResultSchema);
    await call(client, 'list_weeks', {});
    await call(client, 'get_week', { weekStart });
    if (writeVerification)
        await verifyWrites(client, weekStart);
    else
        console.log('Read-only verification complete. Set MCP_VERIFY_WRITE=true to verify write and delete tools.');
    await transport.terminateSession().catch(() => undefined);
    await transport.close();
}
async function verifyWrites(client, weekStart) {
    if (!verificationWeekStart)
        throw new Error('MCP_VERIFY_WEEK_START is required when MCP_VERIFY_WRITE=true. Use an unused Monday: the test writes and deletes it.');
    await call(client, 'upsert_week_menu', { weekStart, items: [{ day: 'monday', lunch: ['Menu de vérification MCP'] }], notes: 'À supprimer automatiquement par pnpm verify.' });
    await call(client, 'upsert_week_message', { weekStart, type: 'blague', text: 'Blague de vérification MCP.' });
    await call(client, 'get_week', { weekStart });
    await call(client, 'delete_week_menu', { weekStart, confirm: 'DELETE_WEEK_MENU' });
    await call(client, 'delete_week_message', { weekStart, confirm: 'DELETE_WEEK_MESSAGE' });
    await call(client, 'clear_week', { weekStart, confirm: 'CLEAR_WEEK' });
    console.log('Read/write/delete verification complete.');
}
function call(client, name, args) {
    return client.request({ method: 'tools/call', params: { name, arguments: args } }, CallToolResultSchema);
}
function assertTools(toolNames) {
    const expected = ['list_weeks', 'get_week', 'upsert_week_menu', 'upsert_week_message', 'delete_week_menu', 'delete_week_message', 'clear_week'];
    for (const tool of expected)
        assert(toolNames.includes(tool), `Missing tool: ${tool}`);
    console.log('Tools available:', toolNames.sort());
}
function assert(condition, message) { if (!condition)
    throw new Error(message); }
function nextMonday() {
    const now = new Date();
    const offset = (8 - now.getDay()) % 7 || 7;
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`;
}
main().catch((error) => { console.error('Verification failed:', error); process.exit(1); });
