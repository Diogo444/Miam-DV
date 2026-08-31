# Miam DV MCP 2.0

Serveur MCP distant de Miam DV. Il expose une seule surface MCP publique,
`/mcp`, et appelle le contrat de données protégé du backend. Le serveur ne
lit ni n'écrit directement dans MySQL.

## Principes du contrat

- Les dates de semaine sont toujours des lundis au format `YYYY-MM-DD`.
- Un menu est le menu complet d'une semaine : un appel d'écriture remplace
  l'intégralité de ses journées. Lire la semaine avant toute modification
  partielle.
- Un message hebdomadaire a un `type` explicite : `proverbe` ou `blague`.
- Les outils de lecture ne modifient rien. Les suppressions demandent une
  confirmation littérale afin que les clients IA puissent les reconnaître.
- Les listes de plats sont des tableaux de chaînes. Aucun texte libre n'est
  interprété comme un menu ; le comportement reste donc prévisible.

## Outils MCP

| Outil | Effet | Paramètres obligatoires |
| --- | --- | --- |
| `list_weeks` | Liste les semaines enregistrées | aucun |
| `get_week` | Lit le menu et le message d'une semaine | `weekStart` |
| `upsert_week_menu` | Crée ou remplace le menu complet | `weekStart`, `items` |
| `upsert_week_message` | Crée ou remplace le proverbe ou la blague | `weekStart`, `type`, `text` |
| `delete_week_menu` | Supprime uniquement le menu d'une semaine | `weekStart`, `confirm: "DELETE_WEEK_MENU"` |
| `delete_week_message` | Supprime uniquement le message d'une semaine | `weekStart`, `confirm: "DELETE_WEEK_MESSAGE"` |
| `clear_week` | Supprime menu et message d'une semaine | `weekStart`, `confirm: "CLEAR_WEEK"` |

`upsert_week_menu.items` contient de 1 à 5 éléments, un par jour ouvré :

```json
{
  "day": "monday",
  "lunch": ["Salade verte", "Poulet rôti", "Compote"],
  "dinner": ["Soupe de légumes"],
  "allergens": ["gluten"]
}
```

`day` accepte seulement `monday`, `tuesday`, `wednesday`, `thursday` ou
`friday`. `dinner`, `allergens` et `notes` sont optionnels. Une journée ne
peut apparaître qu'une fois.

## Ressources et prompt

- `miam-dv://weeks/current` expose les données de la semaine courante.
- `miam-dv://weeks/{weekStart}` expose une semaine précise.
- `prepare_week_menu` aide un client à construire un appel
  `upsert_week_menu` conforme.

## Transport et sécurité

Le serveur utilise Streamable HTTP avec des sessions MCP en mémoire :

- `POST /mcp` initialise et envoie les requêtes JSON-RPC ;
- `GET /mcp` ouvre le flux SSE d'une session existante ;
- `DELETE /mcp` termine une session existante ;
- `GET /health` vérifie que la façade est joignable ;
- `GET /ready` vérifie en plus que le backend est joignable et autorise la
  clé de service.

Les appels internes vers le backend portent soit `X-MCP-KEY`, soit
`Authorization: Bearer <MCP_SERVICE_JWT>`. L'endpoint MCP public n'ajoute pas
d'authentification applicative : il doit être protégé par le reverse proxy
déployé devant lui.

Le contrat interne du backend est protégé par cette identité de service :
`GET /mcp/weeks`, `GET /mcp/week-data`, `PUT` et `DELETE /mcp/week-menu`,
`PUT` et `DELETE /mcp/week-message`, puis `POST /mcp/clear-week`. Ce ne sont
pas des endpoints MCP à connecter depuis un client.

## Migration de base de données

MCP 2.0 conserve le type de chaque message hebdomadaire historique. En
production, lorsque `DB_SYNC=false`, appliquer une fois
`backend/migrations/20260831_add_week_proverb_type.sql` avant le déploiement
du backend.

## Variables d'environnement

| Variable | Obligatoire | Description |
| --- | --- | --- |
| `API_BASE_URL` | oui | URL du backend, par exemple `http://backend:3000` |
| `MCP_API_KEY` ou `MCP_SERVICE_JWT` | oui | Identité de service transmise au backend |
| `MCP_HTTP_HOST` | non | Hôte d'écoute, `127.0.0.1` par défaut |
| `MCP_HTTP_PORT` | non | Port d'écoute, `4310` par défaut |
| `MCP_ALLOWED_HOSTS` | non | Liste CSV des hôtes acceptés par Express |
| `MCP_ALLOWED_ORIGINS` | non | Liste CSV des origines navigateur autorisées |
| `MCP_SERVER_URL` | non | URL testée par `pnpm verify` |

## Installation, exécution et vérification

Les commandes utilisent pnpm. L'installation n'est pas faite automatiquement
par le projet ou les scripts de vérification.

```bash
cd mcp-server
pnpm install
pnpm build
pnpm start
pnpm verify
```

`pnpm verify` utilise un vrai client Streamable HTTP : il contrôle les
capacités, la liste des outils, les ressources, les prompts, `ping` et le
cycle lecture/écriture/suppression sur une semaine de test.
