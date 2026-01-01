import { randomUUID, timingSafeEqual } from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

const apiBaseUrl = process.env.API_BASE_URL;
const apiKey = process.env.MCP_API_KEY;
const serviceJwt = process.env.MCP_SERVICE_JWT;
const httpHost = process.env.MCP_HTTP_HOST ?? '127.0.0.1';
const httpPort = Number.parseInt(process.env.MCP_HTTP_PORT ?? '4310', 10);
const serverAuthToken = process.env.MCP_SERVER_AUTH_TOKEN;
const allowedHosts = parseCsv(process.env.MCP_ALLOWED_HOSTS);
const allowedOrigins = parseCsv(process.env.MCP_ALLOWED_ORIGINS);

if (!apiBaseUrl) {
  throw new Error('API_BASE_URL is required');
}
if (!apiKey && !serviceJwt) {
  throw new Error('Set MCP_API_KEY or MCP_SERVICE_JWT');
}

function emptyToUndefined(value: unknown) {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }
  if (Array.isArray(value)) {
    const cleaned = value
      .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
      .filter(Boolean);
    return cleaned.length > 0 ? cleaned : undefined;
  }
  return value;
}

function normalizeTypeInput(value: unknown) {
  if (typeof value !== 'string') {
    return value;
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === 'blague' || normalized === 'proverbe') {
    return normalized;
  }
  if (normalized === 'joke') {
    return 'blague';
  }
  if (normalized === 'proverb') {
    return 'proverbe';
  }
  return normalized;
}

const weekStartSchema = z
  .string()
  .trim()
  .min(1)
  .refine((value) => isValidWeekStart(value), {
    message: 'weekStart must be a Monday (YYYY-MM-DD or DD/MM/YYYY)',
  });

const shortTextSchema = z.preprocess(
  emptyToUndefined,
  z.string().trim().min(1).max(800).optional(),
);

const mealCourseSchema = z.preprocess(
  emptyToUndefined,
  z.string().trim().min(1).max(300).optional(),
);

const mealObjectSchema = z
  .object({
    starter: mealCourseSchema,
    entree: mealCourseSchema,
    main: mealCourseSchema,
    plat: mealCourseSchema,
    side: mealCourseSchema,
    accompagnement: mealCourseSchema,
    garniture: mealCourseSchema,
    cheese: mealCourseSchema,
    fromage: mealCourseSchema,
    dessert: mealCourseSchema,
  })
  .passthrough()
  .refine((meal) => Object.values(meal).some(Boolean), {
    message: 'Meal object must have at least one non-empty field',
  });

const mealInputSchema = z.union([
  z.string().trim().min(1).max(800),
  z.array(z.string().trim().min(1).max(200)).min(1).max(12),
  mealObjectSchema,
]);

const optionalMealInputSchema = z.preprocess(emptyToUndefined, mealInputSchema.optional());

const menuItemSchema = z
  .object({
    day: z.string().trim().min(1).max(20).refine((value) => normalizeWeekday(value), {
      message: 'day must be monday-friday (english or french)',
    }),
    main: shortTextSchema,
    starter: shortTextSchema,
    dessert: shortTextSchema,
    lunch: optionalMealInputSchema,
    dinner: optionalMealInputSchema,
    midi: optionalMealInputSchema,
    soir: optionalMealInputSchema,
    allergens: z.array(z.string().min(1).max(80)).max(30).optional(),
  })
  .refine((data) => hasMenuContent(data), {
    message: 'menu item needs main/lunch/dinner (or midi/soir)',
  });

const publishWeekMenuSchema = z
  .object({
    weekStart: weekStartSchema,
    items: z.array(menuItemSchema).min(1).max(10),
    notes: z.string().min(1).max(800).optional(),
  })
  .refine((data) => hasUniqueDays(data.items), {
    message: 'Duplicate day entries are not allowed',
  });

const publishWeekProverbSchema = z
  .object({
    weekStart: weekStartSchema,
    text: shortTextSchema,
    texte: shortTextSchema,
    proverbe: shortTextSchema,
    proverb: shortTextSchema,
    content: shortTextSchema,
    blague: shortTextSchema,
    joke: shortTextSchema,
    type: z.preprocess(normalizeTypeInput, z.enum(['blague', 'proverbe']).optional()),
    kind: z.preprocess(normalizeTypeInput, z.enum(['blague', 'proverbe']).optional()),
    author: z.preprocess(emptyToUndefined, z.string().trim().min(1).max(200).optional()),
    auteur: z.preprocess(emptyToUndefined, z.string().trim().min(1).max(200).optional()),
    source: z.preprocess(emptyToUndefined, z.string().trim().min(1).max(300).optional()),
  })
  .refine((data) => Boolean(getProverbText(data)), {
    message: 'text is required',
  });

const publishWeekFromTextSchema = z.object({
  text: z.string().min(1).max(20000),
  year: z.number().int().min(2000).max(2100).optional(),
  weekStart: weekStartSchema.optional(),
  type: z.preprocess(normalizeTypeInput, z.enum(['blague', 'proverbe']).optional()),
  notes: z.preprocess(emptyToUndefined, z.string().trim().min(1).max(800).optional()),
});

const clearWeekDataSchema = z
  .object({
    weekStart: weekStartSchema.optional(),
    scope: z.enum(['currentWeek']).optional(),
    confirm: z.literal('CLEAR_WEEK_DATA'),
  })
  .refine((data) => Boolean(data.weekStart) !== Boolean(data.scope), {
    message: 'Provide weekStart or scope, not both',
  });

const sessions = new Map<
  string,
  { transport: StreamableHTTPServerTransport; server: McpServer }
>();

const app = createMcpExpressApp({
  host: httpHost,
  allowedHosts: allowedHosts.length > 0 ? allowedHosts : undefined,
});

app.use(requestLogger);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/mcp', mcpSecurityMiddleware);

app.post('/mcp', async (req, res) => {
  try {
    await handleMcpPost(req, res);
  } catch (error) {
    handleMcpError(res, error);
  }
});

app.get('/mcp', async (req, res) => {
  try {
    await handleMcpGet(req, res);
  } catch (error) {
    handleMcpError(res, error);
  }
});

app.delete('/mcp', async (req, res) => {
  try {
    await handleMcpDelete(req, res);
  } catch (error) {
    handleMcpError(res, error);
  }
});

const httpServer = app.listen(httpPort, httpHost, () => {
  console.log(`MCP HTTP server listening on http://${httpHost}:${httpPort}/mcp`);
});

httpServer.on('error', (error) => {
  console.error('Failed to start MCP HTTP server:', error);
  process.exit(1);
});

process.on('SIGINT', async () => {
  console.log('Shutting down MCP server...');
  await closeAllSessions();
  process.exit(0);
});

function buildServer() {
  const server = new McpServer({
    name: 'miamdv-mcp',
    version: '1.0.0',
  });

  server.registerTool(
    'publish_week_menu',
    {
      description:
        'Publish or replace the menu for a week starting on Monday. Tip: omit dinner if there is no service (do not send an empty string).',
      inputSchema: publishWeekMenuSchema,
    },
    async (input, _extra) => {
      return callApi('PUT', '/mcp/week-menu', normalizeWeekMenuInput(input));
    },
  );

  server.registerTool(
    'publish_week_proverb',
    {
      description:
        "Publish or replace the proverb/joke for a week starting on Monday. Use 'type' to choose between blague/proverbe.",
      inputSchema: publishWeekProverbSchema,
    },
    async (input, _extra) => {
      return callApi('PUT', '/mcp/week-proverb', normalizeWeekProverbInput(input));
    },
  );

  server.registerTool(
    'publish_week_from_text',
    {
      description:
        'Publish menu + proverb/joke from a raw text block (French). Provide year or weekStart if the text has no year.',
      inputSchema: publishWeekFromTextSchema,
    },
    async (input, _extra) => {
      const parsed = parseWeekContentFromText(input.text, {
        year: input.year,
        weekStart: input.weekStart,
        type: input.type,
      });

      const results: Array<{ label: string; response: ReturnType<typeof textResponse> }> = [];

      const menuResponse = await callApi(
        'PUT',
        '/mcp/week-menu',
        normalizeWeekMenuInput({
          weekStart: parsed.weekStart,
          items: parsed.items,
          notes: input.notes,
        }),
      );
      results.push({ label: 'menu', response: menuResponse });

      if (parsed.proverb?.text) {
        const proverbResponse = await callApi(
          'PUT',
          '/mcp/week-proverb',
          normalizeWeekProverbInput({
            weekStart: parsed.weekStart,
            text: parsed.proverb.text,
            type: parsed.proverb.type,
          }),
        );
        results.push({ label: 'proverb', response: proverbResponse });
      }

      const output = results
        .map((result) => {
          const text = result.response.content[0]?.text ?? 'OK';
          return `${result.label}: ${text}`;
        })
        .join('\n');

      return textResponse(output, results.some((result) => result.response.isError));
    },
  );

  server.registerTool(
    'clear_week_data',
    {
      description:
        'Clear both menu and proverb for a weekStart or for the current week.',
      inputSchema: clearWeekDataSchema,
    },
    async (input, _extra) => {
      return callApi('POST', '/mcp/clear-week', normalizeClearWeekInput(input));
    },
  );

  return server;
}

async function handleMcpPost(req: Request, res: Response) {
  const sessionId = getSessionId(req);
  if (sessionId && sessions.has(sessionId)) {
    const session = sessions.get(sessionId);
    await session?.transport.handleRequest(req, res, req.body);
    return;
  }

  if (!sessionId && isInitializeRequest(req.body)) {
    const server = buildServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (newSessionId) => {
        sessions.set(newSessionId, { transport, server });
        console.log(`MCP session initialized: ${newSessionId}`);
      },
    });

    transport.onclose = () => {
      const currentSessionId = transport.sessionId;
      if (currentSessionId) {
        sessions.delete(currentSessionId);
        server.close();
        console.log(`MCP session closed: ${currentSessionId}`);
      }
    };

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
    return;
  }

  res.status(400).json({
    jsonrpc: '2.0',
    error: {
      code: -32000,
      message: 'Bad Request: Missing or invalid session ID',
    },
    id: null,
  });
}

async function handleMcpGet(req: Request, res: Response) {
  const sessionId = getSessionId(req);
  if (!sessionId || !sessions.has(sessionId)) {
    res.status(400).send('Invalid or missing session ID');
    return;
  }
  const session = sessions.get(sessionId);
  await session?.transport.handleRequest(req, res);
}

async function handleMcpDelete(req: Request, res: Response) {
  const sessionId = getSessionId(req);
  if (!sessionId || !sessions.has(sessionId)) {
    res.status(400).send('Invalid or missing session ID');
    return;
  }
  const session = sessions.get(sessionId);
  await session?.transport.handleRequest(req, res);
}

function handleMcpError(res: Response, error: unknown) {
  console.error('Error handling MCP request:', error);
  if (!res.headersSent) {
    res.status(500).json({
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: 'Internal server error',
      },
      id: null,
    });
  }
}

function mcpSecurityMiddleware(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.length > 0 && !allowedOrigins.includes(origin)) {
    res.status(403).send('Origin not allowed');
    return;
  }

  if (serverAuthToken) {
    const authHeader = req.headers.authorization;
    const apiKeyHeader = req.headers['x-mcp-key'];
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : typeof apiKeyHeader === 'string'
        ? apiKeyHeader
        : undefined;

    if (!token || !safeEqual(token, serverAuthToken)) {
      res.status(401).send('Unauthorized');
      return;
    }
  }

  next();
}

function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  next();
}

function safeEqual(value: string, expected: string) {
  const valueBuf = Buffer.from(value);
  const expectedBuf = Buffer.from(expected);
  if (valueBuf.length !== expectedBuf.length) {
    return false;
  }
  return timingSafeEqual(valueBuf, expectedBuf);
}

function getSessionId(req: Request) {
  const sessionHeader = req.headers['mcp-session-id'];
  return typeof sessionHeader === 'string' ? sessionHeader : undefined;
}

async function callApi(method: 'PUT' | 'POST', path: string, body: unknown) {
  const url = new URL(path, apiBaseUrl).toString();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (serviceJwt) {
    headers.Authorization = `Bearer ${serviceJwt}`;
  } else if (apiKey) {
    headers['X-MCP-KEY'] = apiKey;
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(body),
    });
    const text = await response.text();
    if (!response.ok) {
      return textResponse(
        `Request failed (${response.status}): ${text || response.statusText}`,
        true,
      );
    }

    return textResponse(text || 'OK');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return textResponse(`Request failed: ${message}`, true);
  }
}

const WEEKDAY_ALIASES: Record<string, string> = {
  monday: 'monday',
  lundi: 'monday',
  tuesday: 'tuesday',
  mardi: 'tuesday',
  wednesday: 'wednesday',
  mercredi: 'wednesday',
  thursday: 'thursday',
  jeudi: 'thursday',
  friday: 'friday',
  vendredi: 'friday',
};

function parseIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const parts = value.split('-').map((part) => Number(part));
  if (parts.length !== 3) {
    return null;
  }
  const [year, month, day] = parts;
  if (!year || !month || !day) {
    return null;
  }
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

function parseFrenchDate(value: string) {
  const match = value.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?$/);
  if (!match) {
    return null;
  }
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3] ?? new Date().getFullYear());
  if (!year || !month || !day) {
    return null;
  }
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

function parseFlexibleDate(value: string) {
  return parseIsoDate(value) ?? parseFrenchDate(value);
}

function normalizeWeekStart(value: string) {
  const date = parseFlexibleDate(value);
  if (!date || date.getDay() !== 1) {
    return null;
  }
  return formatLocalDate(date);
}

function isValidWeekStart(value: string) {
  return Boolean(normalizeWeekStart(value));
}

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function normalizeWeekday(value: string) {
  return WEEKDAY_ALIASES[value.trim().toLowerCase()] ?? null;
}

function normalizeMealList(value: string | string[] | undefined) {
  if (!value) {
    return undefined;
  }
  if (Array.isArray(value)) {
    const cleaned = value.map((entry) => entry.trim()).filter(Boolean);
    return cleaned.length > 0 ? cleaned : undefined;
  }
  const cleaned = splitMealText(value);
  return cleaned.length > 0 ? cleaned : undefined;
}

type MealObjectInput = Record<string, unknown> & {
  starter?: string;
  entree?: string;
  main?: string;
  plat?: string;
  side?: string;
  accompagnement?: string;
  garniture?: string;
  cheese?: string;
  fromage?: string;
  dessert?: string;
};

type MealInput = string | string[] | MealObjectInput;

function normalizeMealObject(value: MealObjectInput) {
  const starter = typeof value.entree === 'string' ? value.entree : value.starter;
  const main = typeof value.plat === 'string' ? value.plat : value.main;
  const side =
    typeof value.accompagnement === 'string'
      ? value.accompagnement
      : typeof value.side === 'string'
        ? value.side
        : value.garniture;
  const cheese = typeof value.fromage === 'string' ? value.fromage : value.cheese;
  const dessert = value.dessert;

  const candidates = [starter, main, side, cheese, dessert]
    .filter((entry): entry is string => typeof entry === 'string')
    .map((entry) => entry.trim())
    .filter(Boolean);

  return candidates.length > 0 ? candidates : undefined;
}

function normalizeMealListInput(value: MealInput | undefined) {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (Array.isArray(value)) {
    const cleaned = value.map((entry) => entry.trim()).filter(Boolean);
    return cleaned.length > 0 ? cleaned : undefined;
  }
  if (typeof value === 'string') {
    const cleaned = splitMealText(value);
    return cleaned.length > 0 ? cleaned : undefined;
  }
  if (typeof value === 'object') {
    return normalizeMealObject(value);
  }
  return undefined;
}

function splitMealText(value: string) {
  return value
    .split(/\r?\n|;/g)
    .map((entry) => entry.replace(/^[-\s]+/, '').trim())
    .map((entry) => entry.replace(/^(midi|soir)\s*:?\s*/i, '').trim())
    .filter(Boolean);
}

function joinMealList(items: string[]) {
  return items.join('; ');
}

function hasMenuContent(item: {
  main?: string;
  lunch?: unknown;
  dinner?: unknown;
  starter?: string;
  midi?: unknown;
  soir?: unknown;
}) {
  return Boolean(
    item.main ||
      item.lunch ||
      item.dinner ||
      item.starter ||
      item.midi ||
      item.soir,
  );
}

function normalizeWeekMenuInput(input: {
  weekStart: string;
  items: Array<{
    day: string;
    main?: string;
    starter?: string;
    dessert?: string;
    lunch?: MealInput;
    dinner?: MealInput;
    midi?: MealInput;
    soir?: MealInput;
    allergens?: string[];
  }>;
  notes?: string;
}) {
  const weekStart = normalizeWeekStart(input.weekStart);
  if (!weekStart) {
    throw new Error('weekStart must be a Monday');
  }

  const items = input.items.map((item) => {
    const day = normalizeWeekday(item.day);
    if (!day) {
      throw new Error(`Invalid day value: ${item.day}`);
    }

    const lunch = normalizeMealListInput(item.lunch ?? item.midi ?? item.main);
    const dinner = normalizeMealListInput(item.dinner ?? item.soir ?? item.starter);

    const normalized: Record<string, unknown> = { day };

    if (lunch?.length) {
      normalized.lunch = lunch;
      normalized.main = item.main ?? joinMealList(lunch);
    } else if (item.main) {
      normalized.main = item.main;
    }

    if (dinner?.length) {
      normalized.dinner = dinner;
      normalized.starter = item.starter ?? joinMealList(dinner);
    } else if (item.starter) {
      normalized.starter = item.starter;
    }

    if (item.dessert) {
      normalized.dessert = item.dessert;
    }

    if (item.allergens?.length) {
      normalized.allergens = item.allergens;
    }

    return normalized;
  });

  return {
    weekStart,
    items,
    ...(input.notes ? { notes: input.notes } : {}),
  };
}

function normalizeWeekProverbInput(input: {
  weekStart: string;
  text?: string;
  texte?: string;
  proverbe?: string;
  proverb?: string;
  content?: string;
  blague?: string;
  joke?: string;
  type?: 'blague' | 'proverbe';
  kind?: 'blague' | 'proverbe';
  author?: string;
  auteur?: string;
  source?: string;
}) {
  const weekStart = normalizeWeekStart(input.weekStart);
  if (!weekStart) {
    throw new Error('weekStart must be a Monday');
  }

  const text = getProverbText(input);
  if (!text) {
    throw new Error('text is required');
  }

  const type = input.type ?? input.kind;

  return {
    weekStart,
    text,
    ...(type ? { type } : {}),
    ...(input.author || input.auteur
      ? { author: input.author ?? input.auteur }
      : {}),
    ...(input.source ? { source: input.source } : {}),
  };
}

function getProverbText(input: {
  text?: string;
  texte?: string;
  proverbe?: string;
  proverb?: string;
  content?: string;
  blague?: string;
  joke?: string;
}) {
  return (
    input.text ??
    input.texte ??
    input.proverbe ??
    input.proverb ??
    input.content ??
    input.blague ??
    input.joke
  );
}

function parseWeekContentFromText(
  text: string,
  options: { year?: number; weekStart?: string; type?: 'blague' | 'proverbe' } = {},
) {
  const lines = text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const weekStart = normalizeWeekStartFromText(lines, options);
  if (!weekStart) {
    throw new Error('Unable to infer weekStart. Provide weekStart (YYYY-MM-DD) or a year.');
  }

  const items = parseMenuItemsFromTextLines(lines);
  if (items.length === 0) {
    throw new Error('No menu items detected in text.');
  }

  const proverbText = extractProverbText(lines);
  const inferredType = options.type ?? inferProverbType(proverbText);

  return {
    weekStart,
    items,
    ...(proverbText ? { proverb: { text: proverbText, type: inferredType } } : {}),
  };
}

function normalizeWeekStartFromText(
  lines: string[],
  options: { year?: number; weekStart?: string } = {},
) {
  if (options.weekStart) {
    return normalizeWeekStart(options.weekStart);
  }

  const mondayMatch = lines
    .map((line) => line.match(/^lundi\s+(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?/i))
    .find((match): match is RegExpMatchArray => Boolean(match));
  if (mondayMatch) {
    return normalizeWeekStartFromDayMonth(
      Number(mondayMatch[1]),
      Number(mondayMatch[2]),
      mondayMatch[3] ? Number(mondayMatch[3]) : undefined,
      options.year,
    );
  }

  const rangeMatch = lines
    .map((line) => line.match(/\bdu\s+lundi\s+(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?/i))
    .find((match): match is RegExpMatchArray => Boolean(match));
  if (rangeMatch) {
    return normalizeWeekStartFromDayMonth(
      Number(rangeMatch[1]),
      Number(rangeMatch[2]),
      rangeMatch[3] ? Number(rangeMatch[3]) : undefined,
      options.year,
    );
  }

  return null;
}

function normalizeWeekStartFromDayMonth(
  day: number,
  month: number,
  yearFromText: number | undefined,
  yearOverride: number | undefined,
) {
  if (!day || !month) {
    return null;
  }

  const year = yearFromText ?? yearOverride;
  if (year) {
    return normalizeWeekStart(`${day}/${month}/${year}`);
  }

  const now = new Date();
  const candidates = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1];
  for (const candidate of candidates) {
    const normalized = normalizeWeekStart(`${day}/${month}/${candidate}`);
    if (normalized) {
      return normalized;
    }
  }

  return null;
}

function parseMenuItemsFromTextLines(lines: string[]) {
  const dayRegex = /^(lundi|mardi|mercredi|jeudi|vendredi)\b/i;
  const dayIndices = lines
    .map((line, index) => (dayRegex.test(line) ? index : -1))
    .filter((index) => index >= 0);

  const segments =
    dayIndices.length > 0
      ? dayIndices.map((start, idx) => ({
          start,
          end: idx + 1 < dayIndices.length ? dayIndices[idx + 1] : lines.length,
        }))
      : [];

  const items: Array<{ day: string; lunch?: string[]; dinner?: string[] }> = [];

  for (const segment of segments) {
    const header = lines[segment.start] ?? '';
    const dayName = header.split(/\s+/)[0] ?? '';
    const normalizedDay = normalizeWeekday(dayName);
    if (!normalizedDay) {
      continue;
    }

    const lunch: string[] = [];
    const dinner: string[] = [];
    let section: 'lunch' | 'dinner' | null = null;

    for (const line of lines.slice(segment.start + 1, segment.end)) {
      const normalized = line.toLowerCase();

      if (/(^-?\s*midi\s*:?)|(^-?\s*d[ée]jeuner\s*:?)|(^midi\s*:)/i.test(normalized)) {
        section = 'lunch';
        continue;
      }
      if (/(^-?\s*soir\s*:?)|(^-?\s*d[îi]ner\s*:?)|(^soir\s*:)/i.test(normalized)) {
        section = 'dinner';
        continue;
      }

      if (!section) {
        continue;
      }

      const dish = line.replace(/^[-•\s]+/, '').trim();
      if (!dish) {
        continue;
      }

      if (section === 'lunch') {
        lunch.push(dish);
      } else {
        dinner.push(dish);
      }
    }

    items.push({
      day: normalizedDay,
      ...(lunch.length > 0 ? { lunch } : {}),
      ...(dinner.length > 0 ? { dinner } : {}),
    });
  }

  return items;
}

function extractProverbText(lines: string[]) {
  const dayRegex = /^(lundi|mardi|mercredi|jeudi|vendredi)\b/i;
  const firstDayIndex = lines.findIndex((line) => dayRegex.test(line));
  const headerLines = firstDayIndex >= 0 ? lines.slice(0, firstDayIndex) : lines;

  const candidates = headerLines
    .map((line) => line.replace(/^[-•\s]+/, '').trim())
    .filter(Boolean)
    .filter((line) => !/^menu\b/i.test(line))
    .filter((line) => !/^du\s+lundi\b/i.test(line));

  const preferred = candidates.find((line) => /(blague|proverbe|jeu de mots)/i.test(line));
  return preferred ?? candidates.find((line) => /«.+»/.test(line)) ?? null;
}

function inferProverbType(text: string | null) {
  if (!text) {
    return 'proverbe' as const;
  }
  if (/(blague|jeu de mots)/i.test(text)) {
    return 'blague' as const;
  }
  if (/proverbe/i.test(text)) {
    return 'proverbe' as const;
  }
  return 'proverbe' as const;
}

function normalizeClearWeekInput(input: {
  weekStart?: string;
  scope?: 'currentWeek';
  confirm: 'CLEAR_WEEK_DATA';
}) {
  if (!input.weekStart) {
    return input;
  }

  const weekStart = normalizeWeekStart(input.weekStart);
  if (!weekStart) {
    throw new Error('weekStart must be a Monday');
  }

  return {
    ...input,
    weekStart,
  };
}

function hasUniqueDays(items: Array<{ day: string }>) {
  const seen = new Set<string>();
  for (const item of items) {
    const normalizedDay = normalizeWeekday(item.day);
    if (!normalizedDay) {
      return false;
    }
    if (seen.has(normalizedDay)) {
      return false;
    }
    seen.add(normalizedDay);
  }
  return true;
}

function textResponse(text: string, isError = false) {
  return {
    content: [{ type: 'text' as const, text }],
    ...(isError ? { isError: true } : {}),
  };
}

function parseCsv(value?: string) {
  if (!value) {
    return [];
  }
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

async function closeAllSessions() {
  for (const [sessionId, session] of sessions) {
    try {
      await session.transport.close();
      session.server.close();
      sessions.delete(sessionId);
    } catch (error) {
      console.error(`Error closing session ${sessionId}:`, error);
    }
  }
}
