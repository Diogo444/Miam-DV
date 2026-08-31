import { randomUUID } from 'node:crypto';
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
const apiBaseUrl = requiredEnv('API_BASE_URL');
const apiKey = process.env.MCP_API_KEY;
const serviceJwt = process.env.MCP_SERVICE_JWT;
const httpHost = process.env.MCP_HTTP_HOST ?? '127.0.0.1';
const httpPort = parsePort(process.env.MCP_HTTP_PORT ?? '4310');
const allowedHosts = parseCsv(process.env.MCP_ALLOWED_HOSTS);
const allowedOrigins = parseCsv(process.env.MCP_ALLOWED_ORIGINS);
if (!apiKey && !serviceJwt)
    throw new Error('Set MCP_API_KEY or MCP_SERVICE_JWT');
const weekStartSchema = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine(isMonday, 'La date doit être un lundi réel au format YYYY-MM-DD.')
    .describe('Lundi de la semaine au format YYYY-MM-DD. Exemple : 2026-08-31.');
const mealSchema = z
    .array(z.string().trim().min(1).max(200))
    .min(1)
    .max(12)
    .describe('Liste ordonnée des plats du service, un élément par plat.');
const menuItemSchema = z
    .object({
    day: z
        .enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday'])
        .describe('Jour ouvré en anglais et en minuscules.'),
    lunch: mealSchema.optional().describe('Service du midi ; omettre si absent.'),
    dinner: mealSchema.optional().describe('Service du soir ; omettre si absent.'),
    allergens: z
        .array(z.string().trim().min(1).max(80))
        .max(30)
        .optional()
        .describe('Allergènes connus pour la journée ; omettre si inconnus.'),
})
    .strict()
    .refine((item) => item.lunch || item.dinner, 'Une journée doit avoir un lunch, un dinner, ou les deux.');
const menuSchema = z
    .object({
    weekStart: weekStartSchema,
    items: z
        .array(menuItemSchema)
        .min(1)
        .max(5)
        .refine((items) => new Set(items.map((item) => item.day)).size === items.length, 'Une journée ne peut apparaître qu’une seule fois.')
        .describe('Menu complet de la semaine. Cet outil remplace toutes les journées existantes.'),
    notes: z.string().trim().min(1).max(800).optional().describe('Note générale ; omettre si absente.'),
})
    .strict();
const messageSchema = z
    .object({
    weekStart: weekStartSchema,
    type: z.enum(['proverbe', 'blague']).describe('Nature du message ; ne pas traduire cette valeur.'),
    text: z.string().trim().min(1).max(800).describe('Texte complet à publier.'),
    author: z.string().trim().min(1).max(200).optional().describe('Auteur ou autrice, si connu.'),
    source: z.string().trim().min(1).max(300).optional().describe('Source, si connue.'),
})
    .strict();
const deleteMenuSchema = confirmSchema('DELETE_WEEK_MENU', 'Phrase de confirmation exacte pour supprimer uniquement le menu.');
const deleteMessageSchema = confirmSchema('DELETE_WEEK_MESSAGE', 'Phrase de confirmation exacte pour supprimer uniquement le message.');
const clearWeekSchema = confirmSchema('CLEAR_WEEK', 'Phrase de confirmation exacte pour supprimer menu et message.');
const sessions = new Map();
const app = createMcpExpressApp({ host: httpHost, allowedHosts: allowedHosts.length ? allowedHosts : undefined });
app.use(requestLogger);
app.use('/mcp', originGuard);
app.get('/health', (_request, response) => response.status(200).json({ status: 'ok', version: '2.0.0' }));
app.get('/ready', async (_request, response) => {
    try {
        await backend('GET', '/mcp/weeks');
        response.status(200).json({ status: 'ready', backend: 'reachable' });
    }
    catch (error) {
        response.status(503).json({ status: 'not_ready', backend: errorMessage(error) });
    }
});
app.post('/mcp', (request, response) => void guardMcpRequest(() => handlePost(request, response), response));
app.get('/mcp', (request, response) => void guardMcpRequest(() => handleSessionRequest(request, response), response));
app.delete('/mcp', (request, response) => void guardMcpRequest(() => handleSessionRequest(request, response), response));
const httpServer = app.listen(httpPort, httpHost, () => console.log(`Miam DV MCP 2.0 listening on http://${httpHost}:${httpPort}/mcp`));
httpServer.on('error', (error) => {
    console.error('Failed to start MCP HTTP server:', error);
    process.exit(1);
});
async function handlePost(request, response) {
    const sessionId = getSessionId(request);
    if (sessionId) {
        const session = sessions.get(sessionId);
        if (!session)
            return sendInvalidSession(response);
        return session.transport.handleRequest(request, response, request.body);
    }
    if (!isInitializeRequest(request.body))
        return sendInvalidSession(response);
    const server = buildServer();
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: randomUUID,
        onsessioninitialized: (newSessionId) => {
            sessions.set(newSessionId, { server, transport });
            console.log(`MCP session initialized: ${newSessionId}`);
        },
    });
    transport.onclose = () => {
        if (transport.sessionId)
            sessions.delete(transport.sessionId);
        void server.close();
    };
    await server.connect(transport);
    await transport.handleRequest(request, response, request.body);
}
async function handleSessionRequest(request, response) {
    const session = sessions.get(getSessionId(request) ?? '');
    if (!session)
        return sendInvalidSession(response);
    await session.transport.handleRequest(request, response);
}
function buildServer() {
    const server = new McpServer({ name: 'miam-dv', version: '2.0.0' }, { capabilities: { logging: {} } });
    server.registerTool('list_weeks', {
        title: 'Lister les semaines enregistrées',
        description: 'Liste les semaines qui ont un menu et/ou un message. Utiliser cette lecture avant de modifier une semaine existante.',
        annotations: readOnly,
    }, async () => result('Semaines enregistrées.', await backend('GET', '/mcp/weeks')));
    server.registerTool('get_week', {
        title: 'Lire une semaine',
        description: 'Retourne le menu complet et le message d’un lundi précis, sans modifier aucune donnée.',
        inputSchema: z.object({ weekStart: weekStartSchema }).strict(),
        annotations: readOnly,
    }, async ({ weekStart }) => result(`Données de la semaine ${weekStart}.`, await getWeek(weekStart)));
    server.registerTool('upsert_week_menu', {
        title: 'Créer ou remplacer un menu hebdomadaire',
        description: 'Crée le menu si absent ; sinon remplace son contenu entier. Pour modifier une journée, lire get_week, modifier items, puis envoyer le tableau complet.',
        inputSchema: menuSchema,
        annotations: write,
    }, async (input) => result(`Menu créé ou remplacé pour la semaine ${input.weekStart}.`, await backend('PUT', '/mcp/week-menu', input)));
    server.registerTool('upsert_week_message', {
        title: 'Créer ou remplacer un proverbe ou une blague',
        description: 'Crée le message de la semaine ou le remplace complètement. type indique explicitement proverbe ou blague.',
        inputSchema: messageSchema,
        annotations: write,
    }, async (input) => result(`Message créé ou remplacé pour la semaine ${input.weekStart}.`, await backend('PUT', '/mcp/week-message', input)));
    server.registerTool('delete_week_menu', {
        title: 'Supprimer le menu d’une semaine',
        description: 'Supprime seulement le menu, pas le message. Irréversible : lire get_week avant la confirmation.',
        inputSchema: deleteMenuSchema,
        annotations: destructive,
    }, async (input) => result(`Menu supprimé pour la semaine ${input.weekStart}.`, await backend('DELETE', '/mcp/week-menu', input)));
    server.registerTool('delete_week_message', {
        title: 'Supprimer le proverbe ou la blague d’une semaine',
        description: 'Supprime seulement le message, pas le menu. Irréversible : lire get_week avant la confirmation.',
        inputSchema: deleteMessageSchema,
        annotations: destructive,
    }, async (input) => result(`Message supprimé pour la semaine ${input.weekStart}.`, await backend('DELETE', '/mcp/week-message', input)));
    server.registerTool('clear_week', {
        title: 'Effacer entièrement une semaine',
        description: 'Supprime le menu et le message de la semaine. Irréversible et exige la confirmation CLEAR_WEEK.',
        inputSchema: clearWeekSchema,
        annotations: destructive,
    }, async (input) => result(`Semaine ${input.weekStart} entièrement effacée.`, await backend('POST', '/mcp/clear-week', input)));
    server.registerResource('current-week', 'miam-dv://weeks/current', { title: 'Semaine courante', description: 'Menu et message de la semaine courante.', mimeType: 'application/json' }, async (uri) => resource(uri.href, await backend('GET', '/mcp/week-data')));
    server.registerResource('week-by-start-date', new ResourceTemplate('miam-dv://weeks/{weekStart}', { list: undefined }), { title: 'Semaine par date', description: 'Menu et message d’un lundi YYYY-MM-DD.', mimeType: 'application/json' }, async (uri, { weekStart }) => {
        const parsed = weekStartSchema.safeParse(weekStart);
        if (!parsed.success)
            throw new Error('weekStart doit être un lundi YYYY-MM-DD.');
        return resource(uri.href, await getWeek(parsed.data));
    });
    server.registerPrompt('prepare_week_menu', {
        title: 'Préparer un menu hebdomadaire conforme',
        description: 'Prépare un appel upsert_week_menu au format exact Miam DV.',
        argsSchema: { weekStart: weekStartSchema },
    }, ({ weekStart }) => ({
        messages: [{ role: 'user', content: { type: 'text', text: `Prépare le menu complet de ${weekStart}. Retourne un appel upsert_week_menu, jamais du texte à parser. day vaut monday à friday ; lunch et dinner sont des tableaux. Omettre les champs inconnus.` } }],
    }));
    return server;
}
const readOnly = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };
const write = { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false };
const destructive = { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false };
function confirmSchema(confirmation, description) {
    return z.object({ weekStart: weekStartSchema, confirm: z.literal(confirmation).describe(description) }).strict();
}
async function getWeek(weekStart) {
    return backend('GET', `/mcp/week-data?weekStart=${encodeURIComponent(weekStart)}`);
}
async function backend(method, path, body) {
    const headers = { Accept: 'application/json' };
    if (body !== undefined)
        headers['Content-Type'] = 'application/json';
    if (serviceJwt)
        headers.Authorization = `Bearer ${serviceJwt}`;
    else if (apiKey)
        headers['X-MCP-KEY'] = apiKey;
    const response = await fetch(new URL(path, apiBaseUrl), { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
    const data = parseResponse(await response.text());
    if (!response.ok)
        throw new Error(`Backend ${method} ${path} failed (${response.status}): ${typeof data === 'string' ? data : JSON.stringify(data)}`);
    return data;
}
function result(message, data) {
    return { content: [{ type: 'text', text: `${message}\n\n${JSON.stringify(data, null, 2)}` }] };
}
function resource(uri, data) {
    return { contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(data, null, 2) }] };
}
function parseResponse(text) {
    if (!text)
        return null;
    try {
        return JSON.parse(text);
    }
    catch {
        return text;
    }
}
function isMonday(value) {
    const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!parts)
        return false;
    const [year, month, day] = parts.slice(1).map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day && date.getUTCDay() === 1;
}
function getSessionId(request) {
    const value = request.headers['mcp-session-id'];
    return typeof value === 'string' ? value : undefined;
}
function sendInvalidSession(response) {
    response.status(400).json({ jsonrpc: '2.0', error: { code: -32000, message: 'Bad Request: missing or invalid MCP session ID.' }, id: null });
}
async function guardMcpRequest(operation, response) {
    try {
        await operation();
    }
    catch (error) {
        console.error('Error handling MCP request:', error);
        if (!response.headersSent)
            response.status(500).json({ jsonrpc: '2.0', error: { code: -32603, message: 'Internal MCP server error.' }, id: null });
    }
}
function originGuard(request, response, next) {
    if (request.headers.origin && allowedOrigins.length && !allowedOrigins.includes(request.headers.origin))
        return response.status(403).send('Origin not allowed');
    next();
}
function requestLogger(request, response, next) {
    const start = Date.now();
    response.on('finish', () => console.log(`${request.method} ${request.path} ${response.statusCode} ${Date.now() - start}ms`));
    next();
}
function parseCsv(value) { return value?.split(',').map((entry) => entry.trim()).filter(Boolean) ?? []; }
function parsePort(value) {
    const port = Number.parseInt(value, 10);
    if (!Number.isInteger(port) || port < 1 || port > 65535)
        throw new Error('MCP_HTTP_PORT must be a valid TCP port.');
    return port;
}
function requiredEnv(name) {
    const value = process.env[name]?.trim();
    if (!value)
        throw new Error(`${name} is required`);
    return value;
}
function errorMessage(error) { return error instanceof Error ? error.message : 'unreachable'; }
async function shutdown() {
    console.log('Shutting down MCP server...');
    await Promise.all([...sessions.values()].map(async ({ server, transport }) => { await transport.close(); await server.close(); }));
    httpServer.close();
}
process.on('SIGINT', () => void shutdown());
process.on('SIGTERM', () => void shutdown());
