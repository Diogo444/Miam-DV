import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { CallToolResultSchema, ListToolsResultSchema } from '@modelcontextprotocol/sdk/types.js';
const serverUrl = process.env.MCP_SERVER_URL ?? 'http://localhost:4310/mcp';
const authToken = process.env.MCP_SERVER_AUTH_TOKEN;
async function main() {
    const client = new Client({ name: 'mcp-verify-client', version: '1.0.0' });
    const requestInit = authToken
        ? { headers: { Authorization: `Bearer ${authToken}` } }
        : undefined;
    const transport = new StreamableHTTPClientTransport(new URL(serverUrl), {
        requestInit,
    });
    await client.connect(transport);
    const tools = await client.request({ method: 'tools/list', params: {} }, ListToolsResultSchema);
    const toolNames = tools.tools.map((tool) => tool.name).sort();
    console.log('Tools available:', toolNames);
    assertTool(toolNames, 'publish_week_menu');
    assertTool(toolNames, 'publish_week_proverb');
    assertTool(toolNames, 'clear_week_data');
    const weekStart = getCurrentWeekStart();
    console.log('Using weekStart:', weekStart);
    await client.request({
        method: 'tools/call',
        params: {
            name: 'publish_week_menu',
            arguments: {
                weekStart,
                items: buildMenuItems(),
                notes: 'Menu published by MCP verify script',
            },
        },
    }, CallToolResultSchema);
    console.log('publish_week_menu OK');
    await client.request({
        method: 'tools/call',
        params: {
            name: 'publish_week_proverb',
            arguments: {
                weekStart,
                text: 'Petit test MCP: patience et longueur de temps font plus que force ni que rage.',
                author: 'La Fontaine',
                source: 'Fables (extrait)',
            },
        },
    }, CallToolResultSchema);
    console.log('publish_week_proverb OK');
    await client.request({
        method: 'tools/call',
        params: {
            name: 'clear_week_data',
            arguments: {
                weekStart,
                confirm: 'CLEAR_WEEK_DATA',
            },
        },
    }, CallToolResultSchema);
    console.log('clear_week_data OK');
    await transport.terminateSession().catch(() => undefined);
    await transport.close();
    console.log('Verification complete');
}
function assertTool(toolNames, tool) {
    if (!toolNames.includes(tool)) {
        throw new Error(`Missing tool: ${tool}`);
    }
}
function buildMenuItems() {
    return [
        {
            day: 'monday',
            main: 'Poulet roti',
            starter: 'Salade verte',
            dessert: 'Compote de pommes',
            allergens: ['gluten'],
        },
        {
            day: 'tuesday',
            main: 'Pates a la tomate',
            starter: 'Carottes rapees',
            dessert: 'Yaourt nature',
            allergens: ['gluten', 'lait'],
        },
        {
            day: 'wednesday',
            main: 'Poisson grille',
            starter: 'Soupe de legumes',
            dessert: 'Fruit frais',
            allergens: ['poisson'],
        },
        {
            day: 'thursday',
            main: 'Chili vegetarien',
            starter: 'Taboule',
            dessert: 'Mousse au chocolat',
            allergens: ['lait'],
        },
        {
            day: 'friday',
            main: 'Pizza margherita',
            starter: 'Tomates cerises',
            dessert: 'Glace vanille',
            allergens: ['gluten', 'lait'],
        },
    ];
}
function getCurrentWeekStart() {
    const now = new Date();
    const day = now.getDay();
    const diff = (day + 6) % 7;
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diff);
    return formatLocalDate(monday);
}
function formatLocalDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
main().catch((error) => {
    console.error('Verification failed:', error);
    process.exit(1);
});
