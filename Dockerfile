FROM node:24-slim AS dependencies
WORKDIR /app
COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN --mount=type=cache,target=/root/.npm \
    if [ -f package-lock.json ]; then \
        npm ci --no-audit --no-fund; \
    else \
        echo "No lockfile found" && exit 1; \
    fi;

FROM node:24-slim AS builder
WORKDIR /app
ENV NODE_ENV=production
COPY --from=dependencies /app/node_modules/ ./node_modules/
COPY --from=dependencies /app/src/ ./src/
COPY . .
RUN --mount=type=secret,id=dotenv \
    set -a && \
    . /run/secrets/dotenv && \
    set +a && \
    if [ -f package-lock.json ]; then \
        npm run build; \
    else \
        echo "No lockfile found" && exit 1; \
    fi;

FROM node:24-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
COPY --from=builder --chown=node:node /app/public/ ./public/
RUN mkdir .next
RUN chown node:node .next
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/.next/cache ./.next/cache
USER node
EXPOSE 3000

CMD ["node", "server.js"]