FROM node:20-alpine AS base

# Install dependencies
FROM base as deps

WORKDIR /app

ADD package*.json .

RUN npm ci

# Build the app
FROM base as build

ENV NODE_ENV=production

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
ADD . .

RUN npm run build

# Production image
FROM base

ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /app .

EXPOSE 3000

CMD ["npm", "run", "start"]
