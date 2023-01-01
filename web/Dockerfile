# 1. Install dependencies only when needed
FROM node:18.12.1-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine 
# to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat git
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# 2. Rebuild the source code only when needed
FROM node:17.9.0-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. Production image, copy all the files and run next
FROM --platform=linux/amd64 node:17.9.0-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_APP_ENV_FILE=.env.production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

RUN apk add --no-cache bash
COPY --chown=nextjs:nodejs $NEXT_APP_ENV_FILE ./

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
ENV PORT 3000
CMD ["node", ".next/server"]
