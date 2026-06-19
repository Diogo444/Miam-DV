import { Injectable } from '@nestjs/common';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import * as z from 'zod/v4';
import { McpService } from './mcp.service';
import {
  MCP_SCOPE_MENU_WRITE,
  MCP_SCOPE_PROVERB_WRITE,
  MCP_SCOPE_WEEK_CLEAR,
  MCP_SCOPE_WEEK_READ,
  type McpScope,
} from './mcp.constants';
import type { McpAuthInfo } from './guards/mcp.guard';

const WEEKDAY_INPUTS = [
  'monday',
  'lundi',
  'tuesday',
  'mardi',
  'wednesday',
  'mercredi',
  'thursday',
  'jeudi',
  'friday',
  'vendredi',
] as const;

const weekStartSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .describe('Date du lundi de la semaine au format YYYY-MM-DD.');

const mealTextSchema = z.union([
  z.string().min(1).max(800),
  z.array(z.string().min(1).max(200)).min(1).max(12),
]);

const menuItemSchema = z.object({
  day: z.enum(WEEKDAY_INPUTS).describe('Jour ouvré, en français ou en anglais.'),
  lunch: mealTextSchema.optional().describe('Plats du midi, sous forme de texte ou de liste.'),
  dinner: mealTextSchema.optional().describe('Plats du soir, sous forme de texte ou de liste.'),
  midi: mealTextSchema.optional().describe('Alias français de lunch.'),
  soir: mealTextSchema.optional().describe('Alias français de dinner.'),
  main: z.string().min(1).max(800).optional().describe('Compatibilité ancienne API: plat principal.'),
  starter: z.string().min(1).max(800).optional().describe('Compatibilité ancienne API: entrée.'),
  dessert: z.string().min(1).max(800).optional(),
  allergens: z.array(z.string().max(80)).max(30).optional(),
});

@Injectable()
export class McpServerFactory {
  constructor(private readonly mcpService: McpService) {}

  create(auth?: McpAuthInfo) {
    const server = new McpServer(
      {
        name: 'miam-dv',
        version: '1.0.0',
      },
      {
        capabilities: {
          logging: {},
        },
      },
    );

    server.registerTool(
      'get_week_data',
      {
        title: 'Lire les données hebdomadaires',
        description: 'Retourne le menu et le proverbe enregistrés pour une semaine.',
        inputSchema: {
          weekStart: weekStartSchema.optional(),
        },
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false,
        },
      },
      async ({ weekStart }) => {
        const denied = this.denyIfMissingScope(auth, MCP_SCOPE_WEEK_READ);
        if (denied) {
          return denied;
        }

        const data = await this.mcpService.getWeekData(weekStart);
        return jsonToolResult(data, `Données chargées pour la semaine ${data.weekStart}.`);
      },
    );

    server.registerTool(
      'publish_week_menu',
      {
        title: 'Publier le menu hebdomadaire',
        description: 'Crée ou remplace le menu de la semaine et synchronise les tables historiques.',
        inputSchema: {
          weekStart: weekStartSchema,
          items: z.array(menuItemSchema).min(1).max(10),
          notes: z.string().min(1).max(800).optional(),
        },
        annotations: {
          readOnlyHint: false,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false,
        },
      },
      async (input) => {
        const denied = this.denyIfMissingScope(auth, MCP_SCOPE_MENU_WRITE);
        if (denied) {
          return denied;
        }

        const result = await this.mcpService.publishWeekMenu(input);
        return jsonToolResult(result, `Menu publié pour la semaine ${result.weekStart}.`);
      },
    );

    server.registerTool(
      'publish_week_proverb',
      {
        title: 'Publier le proverbe hebdomadaire',
        description: 'Crée ou remplace le proverbe de la semaine et synchronise la table historique.',
        inputSchema: {
          weekStart: weekStartSchema,
          text: z.string().min(1).max(800),
          type: z.enum(['blague', 'proverbe']).optional(),
          author: z.string().min(1).max(200).optional(),
          source: z.string().min(1).max(300).optional(),
        },
        annotations: {
          readOnlyHint: false,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false,
        },
      },
      async (input) => {
        const denied = this.denyIfMissingScope(auth, MCP_SCOPE_PROVERB_WRITE);
        if (denied) {
          return denied;
        }

        const result = await this.mcpService.publishWeekProverb(input);
        return jsonToolResult(result, `Proverbe publié pour la semaine ${result.weekStart}.`);
      },
    );

    server.registerTool(
      'clear_week_data',
      {
        title: 'Effacer une semaine',
        description: 'Supprime les données hebdomadaires et vide les tables historiques de menu/proverbe.',
        inputSchema: {
          weekStart: weekStartSchema.optional(),
          scope: z.enum(['currentWeek']).optional(),
          confirm: z.literal('CLEAR_WEEK_DATA'),
        },
        annotations: {
          readOnlyHint: false,
          destructiveHint: true,
          idempotentHint: true,
          openWorldHint: false,
        },
      },
      async (input) => {
        const denied = this.denyIfMissingScope(auth, MCP_SCOPE_WEEK_CLEAR);
        if (denied) {
          return denied;
        }

        const result = await this.mcpService.clearWeekData(input);
        return jsonToolResult(result, `Données effacées pour la semaine ${result.weekStart}.`);
      },
    );

    server.registerResource(
      'current-week-data',
      'miam-dv://weeks/current',
      {
        title: 'Données de la semaine courante',
        description: 'Menu et proverbe actuellement publiés.',
        mimeType: 'application/json',
      },
      async (uri) => {
        this.assertScope(auth, MCP_SCOPE_WEEK_READ);
        const data = await this.mcpService.getWeekData();
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: 'application/json',
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      },
    );

    server.registerPrompt(
      'prepare_week_menu',
      {
        title: 'Préparer un menu hebdomadaire',
        description: 'Génère une consigne structurée pour préparer un menu publiable via MCP.',
        argsSchema: {
          weekStart: weekStartSchema.optional(),
        },
      },
      ({ weekStart }) => ({
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: [
                `Prépare un menu de cantine pour ${weekStart ?? 'la semaine courante'}.`,
                'Retourne ensuite un appel au tool publish_week_menu avec un item par jour ouvré.',
                'Chaque item doit contenir day, lunch ou midi, dinner ou soir, et éventuellement dessert/allergens.',
              ].join('\n'),
            },
          },
        ],
      }),
    );

    return server;
  }

  private denyIfMissingScope(auth: McpAuthInfo | undefined, scope: McpScope): CallToolResult | null {
    if (auth?.scopes.includes(scope)) {
      return null;
    }

    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `Accès refusé: scope MCP requis ${scope}.`,
        },
      ],
    };
  }

  private assertScope(auth: McpAuthInfo | undefined, scope: McpScope) {
    if (!auth?.scopes.includes(scope)) {
      throw new Error(`Accès refusé: scope MCP requis ${scope}.`);
    }
  }
}

function jsonToolResult(data: unknown, message: string): CallToolResult {
  return {
    content: [
      {
        type: 'text',
        text: `${message}\n\n${JSON.stringify(data, null, 2)}`,
      },
    ],
  };
}
