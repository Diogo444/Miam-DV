FROM node:26-alpine3.24 AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++ \
    && npm install --global pnpm@12.18.0

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY src ./src
COPY nest-cli.json tsconfig.json tsconfig.build.json ./

RUN pnpm build \
    && pnpm prune --prod

FROM node:26-alpine3.24 AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json ./

USER node
EXPOSE 3000

CMD ["node", "dist/main.js"]
