## TODO as BUILD mutli step
FROM node:22-alpine AS base

RUN corepack enable pnpm

FROM base AS builder
WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

# RUN pnpm install --production --frozen-lockfile
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

RUN pnpm prune --prod

FROM base AS runner
WORKDIR /app

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

EXPOSE 3000

ENV NODE_ENV=production ADDRESS=0.0.0.0 PORT=3000

# CMD ["node", "api.ts"]
# CMD ["pnpm", "start"]
CMD ["node_modules/.bin/fastify", "start", "-l", "info", "-a", "0.0.0.0", "-p", "3000", "dist/app.js"]
# CMD ["node", "dist/app.js"]