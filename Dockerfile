FROM node:20-alpine AS base
WORKDIR /usr/src/app
RUN apk update && apk upgrade npm

FROM base as install
COPY package.json package-lock.json .
RUN npm ci

FROM install AS prerelease
ENV NODE_ENV=production
COPY --from=install /usr/src/app/node_modules node_modules
ADD . .
RUN npm run build
RUN npm run seed

FROM base AS release
ENV NODE_ENV=production
COPY --from=prerelease /usr/src/app .

EXPOSE 3000/tcp
CMD ["npm", "run", "start"]
