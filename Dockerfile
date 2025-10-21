## TODO as BUILD mutli step
FROM node:22-alpine

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

RUN corepack enable
RUN pnpm install

COPY . .
# COPY .env.prod .env


EXPOSE 3000

ENV ADDRESS=0.0.0.0 PORT=3000

# CMD ["node", "api.ts"]
CMD ["pnpm", "start"]