FROM node:24-alpine AS builder

WORKDIR /app

RUN npm install --global pnpm@11.24.0

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY tsconfig.json ./
COPY src ./src

RUN pnpm build \
    && pnpm prune --prod

FROM node:24-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json ./

USER node

EXPOSE 4310

CMD ["node", "dist/index.js"]
