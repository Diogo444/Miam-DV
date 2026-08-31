# MiamDV

Application web avec un front Angular et un back NestJS pour gerer menus, proverbes,
suggestions et administrateurs.

## Prerequis

- Node.js 24 LTS
- pnpm 11.24 (`packageManager` est fixe dans chaque package)
- Docker Engine avec Docker Compose

## Architecture

- Frontend: `src/` (Angular standalone components, services, interceptors)
- Backend: `backend/` (NestJS + TypeORM + MySQL)
- Base API: `/api` (proxy dev + reverse-proxy Caddy en prod)
- Serveur MCP: `mcp-server/` (façade MCP HTTP 2.0 -> contrat de données backend)

## Serveur MCP (mcp-server)

La documentation complète et le contrat destiné aux clients IA se trouvent
dans [mcp-server/README.md](mcp-server/README.md).

Le serveur MCP expose des tools MCP via HTTP (Streamable HTTP) et relaie les
commandes vers l'API backend (`/mcp/week-menu`, `/mcp/week-proverb`,
`/mcp/clear-week`).

### Fonctionnement

- Endpoint MCP: `POST/GET/DELETE /mcp`
- Healthcheck: `GET /health`
- Sessions: l'initialisation cree un `sessionId`, le client doit ensuite
  envoyer `mcp-session-id` en header sur les requetes suivantes. Les sessions
  sont en memoire et sont supprimees a la fermeture du transport.

### Tools exposes

- `publish_week_menu`: publie/replace le menu d'une semaine.
  - `weekStart`: date ISO `YYYY-MM-DD` (doit etre un lundi, le MCP accepte
    aussi `DD/MM/YYYY`)
  - `items[]`: `day` (monday-friday, accepte aussi lundi-vendredi),
    `lunch`/`dinner` (listes/texte, ou objet `{ starter, main, side, cheese, dessert }`) ou `main`/`starter` (compat),
    `dessert`/`allergens[]` (optionnels), `midi`/`soir` acceptes en alias
  - `notes` (optionnel)
- `publish_week_proverb`: publie/replace le proverbe d'une semaine.
  - `weekStart`: date ISO `YYYY-MM-DD` (doit etre un lundi)
  - `text` (obligatoire, alias: `texte`, `proverbe`, `blague`, `content`), `type` (optionnel: `blague` | `proverbe`),
    `author`/`auteur`/`source` (optionnels)
- `publish_week_from_text`: publie menu + proverbe/blague a partir d'un bloc texte (format FR).
  - `text` (obligatoire)
  - `year` (optionnel) ou `weekStart` (optionnel) si le texte n'indique pas l'annee
  - `type` (optionnel: `blague` | `proverbe`) et `notes` (optionnel)
- `clear_week_data`: supprime menu + proverbe d'une semaine.
  - `weekStart` ou `scope: currentWeek` (un seul des deux)
  - `confirm: "CLEAR_WEEK_DATA"`

### Variables d'environnement

Obligatoires:
- `API_BASE_URL` (ex: `http://localhost:3000`)
- `MCP_API_KEY` ou `MCP_SERVICE_JWT` (auth vers l'API backend)

Optionnelles:
- `MCP_HTTP_HOST` (defaut `127.0.0.1`)
- `MCP_HTTP_PORT` (defaut `4310`)
- `MCP_ALLOWED_HOSTS` (liste CSV, ex `localhost,127.0.0.1`)
- `MCP_ALLOWED_ORIGINS` (liste CSV, ex `http://localhost`)

Authentification:
- Vers le backend: `MCP_SERVICE_JWT` -> `Authorization: Bearer ...`
  ou `MCP_API_KEY` -> `X-MCP-KEY: ...`

### Demarrage

```bash
cd mcp-server
copy .env.example .env
pnpm install
pnpm build
pnpm start
```

Le serveur ecoute sur `http://<MCP_HTTP_HOST>:<MCP_HTTP_PORT>/mcp`.

### Verification rapide

```bash
cd mcp-server
pnpm verify
```

Variables utiles:
- `MCP_SERVER_URL` (defaut `http://localhost:4310/mcp`)
  (le serveur n'exige pas d'authentification)

## Lancer le projet (developpement local)

### Base de donnees (MySQL 8.4.10 LTS via Docker)

```bash
docker compose up -d db
```

Parametres de connexion (les valeurs sont definies dans `.env`) :
- host: `127.0.0.1`
- port: `3306`
- database: `miamdv`
- user: `miammi`
- password: valeur de `MYSQL_PASSWORD`

### Backend (NestJS)

Variables d'environnement requises:
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_SYNC` (true/false)
- `JWT_SECRET`
- `JWT_EXPIRES_IN` (optionnel, defaut `1d`)
- `PORT` (optionnel, defaut `3000`)
- `CORS_ORIGIN` (optionnel, ex: `http://localhost:4200`)

```bash
cd backend
pnpm install
pnpm start:dev
```

Le back utilise `DB_SYNC=true` pour creer/mettre a jour les tables en dev.

### Frontend (Angular)

```bash
pnpm install
pnpm start
```

Le front tourne sur `http://localhost:4200`. Le proxy Angular defini dans
`proxy.conf.json` transmet `/api` au backend local sur le port 3000.

## Deploiement (Docker + Caddy)

1) Creer le reseau externe attendu si necessaire: `docker network create caddy_net`.
2) Copier `.env.example` en `.env`, puis remplacer au minimum `JWT_SECRET`,
   `MCP_API_KEY`, `DEFAULT_ADMIN_PASSWORD` et les mots de passe d'exemple.
3) Lancer l'infrastructure:

```bash
docker compose up -d --build
```

- Front Nginx: `http://localhost:4000` (modifiable avec `FRONTEND_PORT`)
- API via le proxy Nginx: `http://localhost:4000/api`
- Tous les services utilisent `restart: unless-stopped`; les healthchecks
  ordonnent le demarrage MySQL -> backend -> frontend/serveur MCP.

Pour activer HTTPS avec Caddy, remplacez `:80` par votre domaine dans `Caddyfile`.

## Notes production

- Definir un `JWT_SECRET` fort dans `.env`.
- Definir explicitement l'identifiant et un mot de passe initial fort avec
  `DEFAULT_ADMIN_USERNAME` et `DEFAULT_ADMIN_PASSWORD`. Aucun compte
  `admin/admin` n'est cree automatiquement.
- Passer `DB_SYNC=false` et gerer les migrations TypeORM pour la base.
- Fixer `CORS_ORIGIN` a votre domaine (ex: `https://votre-domaine.tld`).
- Les lectures publiques et la creation d'une suggestion restent publiques;
  les mutations de menus, proverbes, suggestions et administrateurs exigent
  un JWT portant le role `admin`.

## Authentification et securite

- Login: `POST /api/auth/login` -> renvoie `access_token` (JWT).
- Le token est stocke dans `localStorage` (`auth_token`) avec le role (`auth_role`).
- L'interceptor ajoute automatiquement `Authorization: Bearer <token>` sur les requetes.
- En cas de `401/403`, le front efface le token et redirige vers `/login`.
- Invalidation de token:
  - Le token contient `tokenVersion`.
  - Lorsqu'un admin est modifie (username/password/role), `tokenVersion` est incremente.
  - Le JWT est rejete si `tokenVersion` ne correspond pas.
  - Si l'admin est supprime, le token devient invalide (utilisateur introuvable).

## API Reference

### Auth

`POST /api/auth/register`
- Body: `{ username, password, role? }`
- Response: `{ access_token, user }`

`POST /api/auth/login`
- Body: `{ username, password }`
- Response: `{ access_token, user }`

`GET /api/auth/me` (Bearer + role admin)
- Response: `{ user }`

### Administrateurs

`GET /api/admins` (Bearer + role admin)
- Response: `Admin[]`

`GET /api/admins/:id` (Bearer + role admin)
- Response: `Admin`

`POST /api/admins`
- Body: `{ username, password, role? }`
- Response: `Admin`

`PATCH /api/admins/:id` (Bearer + role admin)
- Body: `{ username?, password?, role? }`
- Response: `Admin`

`DELETE /api/admins/:id` (Bearer + role admin)
- Response: `{ deleted: true }`

### Menus

`GET /api/menus`
- Response: `Menu[]`

`GET /api/menus/:id`
- Response: `Menu`

`POST /api/menus` (Bearer + role admin)
- Body: `{ jour, periode, entree, plat, fromage, dessert }`
- Response: `{ created, message, menu }`

`PATCH /api/menus/:id`
- Body: `{ jour?, periode?, entree?, plat?, fromage?, dessert? }`
- Response: `{ message, menu }`

`DELETE /api/menus/:id`
- Response: TypeORM delete result

`DELETE /api/menus` (Bearer + role admin)
- Response: `{ message }`
- Note: un cron supprime aussi menus + proverbes + `proverbes_suggered` tous les vendredis a 16:00 (Europe/Paris).

### Proverbes

`GET /api/proverbes`
- Response: `Proverbe | null` (record id=1)

`GET /api/proverbes/suggested`
- Response: `ProverbeSuggered | null` (dernier enregistrement accepte)

`POST /api/proverbes`
- Body: `{ id?, type, content }` (type: `blague` | `proverbe`)
- Response: `{ message, proverbe }`

`PATCH /api/proverbes`
- Body: `{ type?, content? }`
- Response: `Proverbe | null`

`DELETE /api/proverbes`
- Response: `Proverbe | null`

### Suggestions

`POST /api/suggestions`
- Body: `{ type: 'Blague' | 'Proverbe', content }`
- Response: `Suggestion`

`GET /api/suggestions` (Bearer + role admin)
- Response: `Suggestion[]`

`POST /api/suggestions/accept/:id`
- Response: `Suggestion` (la suggestion acceptee est copiee dans `proverbes_suggered` puis supprimee)

`DELETE /api/suggestions/:id`
- Response: TypeORM delete result

## Modeles utilises (front)

- Admin: `{ id, username, role?, passwordUpdatedAt? }`
- Menu: `{ id, jour, periode, entree, plat, fromage, dessert }`
- Proverbe: `{ id, type, content }`
- ProverbeSuggered: `{ id, type, content }`
- Suggestion: `{ id, type, content }`
