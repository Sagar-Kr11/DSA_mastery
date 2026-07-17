# syntax=docker/dockerfile:1

# Multi-stage Dockerfile for DSA Mastery (TanStack Start + Lovable Cloud)
# Build with:
#   docker build \
#     --build-arg VITE_SUPABASE_URL=... \
#     --build-arg VITE_SUPABASE_PUBLISHABLE_KEY=... \
#     --build-arg VITE_SUPABASE_PROJECT_ID=... \
#     --build-arg LOVABLE_API_KEY=... \
#     -t dsa-mastery .

# Build arguments available in every stage
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_SUPABASE_PROJECT_ID
ARG LOVABLE_API_KEY

# ---- Build stage ----
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Vite-injected variables needed by the client bundle at build time
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_PUBLISHABLE_KEY=${VITE_SUPABASE_PUBLISHABLE_KEY}
ENV VITE_SUPABASE_PROJECT_ID=${VITE_SUPABASE_PROJECT_ID}
ENV LOVABLE_API_KEY=${LOVABLE_API_KEY}

# Use the Nitro Node server preset so the output runs as a standalone process
ENV NITRO_PRESET=node-server

# Copy package manager files first for a dependency-cache layer
COPY package.json bunfig.toml bun.lock ./

# Install dependencies (bun.lock is a text lockfile thanks to bunfig.toml)
RUN bun install --frozen-lockfile

# Copy the rest of the source and build
COPY . .
RUN bun run build

# ---- Production stage ----
FROM node:20-alpine

WORKDIR /app

# Install wget for the healthcheck
RUN apk add --no-cache wget

ENV NODE_ENV=production
ENV PORT=3000

# Vite-injected client variables (also used server-side by the Supabase client)
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_PUBLISHABLE_KEY=${VITE_SUPABASE_PUBLISHABLE_KEY}
ENV VITE_SUPABASE_PROJECT_ID=${VITE_SUPABASE_PROJECT_ID}

# Unprefixed variables used by the server-side Supabase client
ENV SUPABASE_URL=${VITE_SUPABASE_URL}
ENV SUPABASE_PUBLISHABLE_KEY=${VITE_SUPABASE_PUBLISHABLE_KEY}

# Required for Lovable Cloud auth / OAuth and connector services
ENV LOVABLE_API_KEY=${LOVABLE_API_KEY}

# Copy the Nitro production output and package metadata
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/package.json /app/package.json

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --start-interval=5s \
  CMD wget --spider -q http://localhost:3000/ || exit 1

CMD ["node", ".output/server/index.mjs"]
