# MiamDV

Application web avec un front Angular et un back NestJS pour gerer menus, proverbes,
suggestions et administrateurs.

## Architecture

- Frontend: `src/` (Angular standalone components, services, interceptors)
- Backend: `backend/` (NestJS + TypeORM + MySQL)
- Base API: `/api` (proxy dev + reverse-proxy Caddy en prod)
- Serveur MCP: `mcp-server/` (MCP HTTP -> appels vers l'API backend)

## Serveur MCP (mcp-server)

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
- `MCP_SERVER_AUTH_TOKEN` (token requis pour les clients MCP)
- `MCP_ALLOWED_HOSTS` (liste CSV, ex `localhost,127.0.0.1`)
- `MCP_ALLOWED_ORIGINS` (liste CSV, ex `http://localhost`)

Authentification:
- Vers le backend: `MCP_SERVICE_JWT` -> `Authorization: Bearer ...`
  ou `MCP_API_KEY` -> `X-MCP-KEY: ...`
- Vers le serveur MCP (optionnel): `Authorization: Bearer ...` ou `X-MCP-KEY`
  doit correspondre a `MCP_SERVER_AUTH_TOKEN`

### Demarrage

```bash
cd mcp-server
copy .env.example .env
npm install
npm run build
npm run start
```

Le serveur ecoute sur `http://<MCP_HTTP_HOST>:<MCP_HTTP_PORT>/mcp`.

### Verification rapide

```bash
cd mcp-server
npm run verify
```

Variables utiles:
- `MCP_SERVER_URL` (defaut `http://localhost:4310/mcp`)
- `MCP_SERVER_AUTH_TOKEN` si la protection serveur est activee

## Prerequis

- Node.js
- Un gestionnaire de paquets (pnpm, npm, yarn)
- MySQL (ou Docker pour lancer la base)
- Docker (recommande pour la prod)

## Lancer le projet (developpement local)

### Base de donnees (MySQL via Docker)

```bash
docker compose up -d db
```

Identifiants par defaut (voir `docker-compose.yml`) :
- host: `127.0.0.1`
- port: `3306`
- database: `miamdv`
- user: `miammi`
- password: `BDDmiammi`

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

Le front tourne sur `http://localhost:4200` et utilise le proxy `/api` vers le backend.

## Deploiement (Docker + Caddy)

1) Copier `.env.example` en `.env` et definir les variables.
2) Lancer l'infra:

```bash
docker compose up -d --build
```

- Front + reverse-proxy: `http://localhost`
- API: `http://localhost/api`

Pour activer HTTPS avec Caddy, remplacez `:80` par votre domaine dans `Caddyfile`.

## Notes production

- Definir un `JWT_SECRET` fort dans `.env`.
- Passer `DB_SYNC=false` et gerer les migrations TypeORM pour la base.
- Fixer `CORS_ORIGIN` a votre domaine (ex: `https://votre-domaine.tld`).
- Verifier quelles routes doivent etre protegees (certains endpoints sont publics par defaut).

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
- Note: un cron supprime aussi menus + proverbes tous les vendredis a 16:00 (Europe/Paris).

### Proverbes

`GET /api/proverbes`
- Response: `Proverbe | null` (record id=1)

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
- Response: `Suggestion` (la suggestion acceptee est copiee dans `proverbes` puis supprimee)

`DELETE /api/suggestions/:id`
- Response: TypeORM delete result

## Modeles utilises (front)

- Admin: `{ id, username, role?, passwordUpdatedAt? }`
- Menu: `{ id, jour, periode, entree, plat, fromage, dessert }`
- Proverbe: `{ id, type, content }`
- Suggestion: `{ id, type, content }`
