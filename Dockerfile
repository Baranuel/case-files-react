# Build stage
FROM node:22-alpine AS base


FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile
# Production stage


FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable pnpm && pnpm build


FROM build AS runner
WORKDIR /app

COPY --from=build /app/.env.production ./
COPY --from=build /app/pnpm-lock.yaml ./
COPY --from=build /app/package.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules


ENV NODE_ENV=production


# Set the command to serve the app
CMD ["pnpm", "start", "--host"]