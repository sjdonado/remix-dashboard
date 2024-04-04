FROM oven/bun:alpine AS base

WORKDIR /usr/src/app

RUN apk update && apk add python3 nodejs

FROM base as install
COPY package.json bun.lockb .
RUN bun install

FROM install AS prerelease
ENV NODE_ENV=production
COPY --from=install /usr/src/app/node_modules node_modules
ADD . .
RUN bun run build

FROM base AS release
ENV NODE_ENV=production
COPY --from=prerelease /usr/src/app .

EXPOSE 3333/tcp
CMD ["bun", "run", "start"]
