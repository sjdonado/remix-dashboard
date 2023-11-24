FROM oven/bun:1.0.14

EXPOSE 3000

WORKDIR /usr/src/app

ENV NODE_ENV production

COPY package.json .
COPY bun.lockb .

RUN bun install

COPY . .

RUN bun run build

CMD ["bun", "run", "start"]
