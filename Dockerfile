FROM node:lts-slim AS dependencies
WORKDIR /app
COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN --mount=type=cache,target=/root/.npm \
    if [ -f package-lock.json ]; then \
        npm ci --no-audit --no-fund; \
    else \
        echo "No lockfile found" && exit 1; \
    fi;

FROM node:lts-slim AS builder
ENV NODE_ENV=production
WORKDIR /app
COPY --from=dependencies /app/node_modules/ ./node_modules/
COPY --from=dependencies /app/src/ ./src/
COPY . .
RUN --mount=type=secret,id=base_url,env=BASE_URL \
    --mount=type=secret,id=better_auth_secrets,env=BETTER_AUTH_SECRETS \
    --mount=type=secret,id=better_auth_url,env=BETTER_AUTH_URL \
    --mount=type=secret,id=database_url,env=DATABASE_URL \ 
    --mount=type=secret,id=google_client_id,env=GOOGLE_CLIENT_ID \
    --mount=type=secret,id=google_client_secret,env=GOOGLE_CLIENT_SECRET \
    --mount=type=secret,id=mailerlite_api_key,env=MAILERLITE_API_KEY \
    --mount=type=secret,id=microsoft_client_id,env=MICROSOFT_CLIENT_ID \
    --mount=type=secret,id=microsoft_client_secret,env=MICROSOFT_CLIENT_SECRET \
    --mount=type=secret,id=s3_bucket,env=S3_BUCKET \
    --mount=type=secret,id=s3_bucket_region,env=S3_BUCKET_REGION \
    --mount=type=secret,id=yandex_client_id,env=YANDEX_CLIENT_ID \
    --mount=type=secret,id=yandex_client_secret,env=YANDEX_CLIENT_SECRET \
    if [ -f package-lock.json ]; then \
        npm run build; \
    else \
        echo "No lockfile found" && exit 1; \
    fi;

FROM node:lts-slim AS runner
ARG PORT=3000
ENV NODE_ENV=production
ENV PORT=${PORT}
ENV HOSTNAME=0.0.0.0
WORKDIR /app
COPY --from=builder --chown=node:node /app/public/ ./public/
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE ${PORT}

CMD ["node", "server.js"]