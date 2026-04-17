FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./

FROM base AS deps
RUN npm ci

FROM base AS deps-prod
RUN npm ci --omit=dev

FROM base AS develop
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3001
CMD ["npm", "run", "start:dev"]

FROM deps AS build
COPY . .
RUN npm run build

FROM node:22-alpine AS production
ENV NODE_ENV=production
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY --from=build /app/dist ./dist
COPY --from=deps-prod /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh \
    && chown -R node:node /app
EXPOSE 3001
USER node
ENTRYPOINT ["./docker-entrypoint.sh"]
