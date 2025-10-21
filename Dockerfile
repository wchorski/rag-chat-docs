FROM node:22-apline

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm install

COPY . .
COPY .env.prod .env

EXPOSE 3000

ENV ADDRESS=0.0.0.0 PORT=3000

# CMD ["node", "api.ts"]
CMD ["pnpm", "start"]