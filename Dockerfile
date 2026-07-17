# syntax=docker/dockerfile:1

# Multi-stage Dockerfile for DSA Mastery (TanStack Start + Lovable Cloud)
# Build with: docker build --build-arg VITE_SUPABASE_URL=... --build-arg VITE_SUPABASE_PUBLISHABLE_KEY=... -t dsa-mastery .

# ---- Build stage ----
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Copy package manager files first for a dependency-cache layer
COPY package.json bunfig.toml bun.lock ./

# Install dependencies (bun.lock is a text lockfile thanks to bunfig.toml)
RUN bun install --frozen-lockfile

# Copy the rest of the source and build for the Node server preset
COPY . .
ENV NITRO_PRESET=node-server
RUN bun run build

# ---- Production stage ----
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Vite-injected client variables (must be present at build time, so they are
# passed as ARG/ENV in the builder stage). These are also used server-side by
# the Lovable Cloud / Supabase client.
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_PUBLISHABLE_KEY=${VITE_SUPABASE_PUBLISHABLE_KEY}
ENV SUPABASE_URL=${VITE_SUPABASE_URL}
ENV SUPABASE_PUBLISHABLE_KEY=${VITE_SUPABASE_PUBLISHABLE_KEY}

# Copy the Nitro production output and package metadata
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/package.json /app/package.json

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
