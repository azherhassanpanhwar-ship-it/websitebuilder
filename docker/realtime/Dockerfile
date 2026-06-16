# syntax=docker/dockerfile:1.7
# ────────────────────────────────────────────────────────────────────────────
# LATTICE realtime server image (Task 1.5)
# ────────────────────────────────────────────────────────────────────────────
# Multi-stage build:
#   1. base    — node + pnpm + the entire monorepo
#   2. runtime — slim final image with just the realtime package
#
# In dev, this runs `pnpm --filter @lattice/realtime dev` (tsx watch).
# For production, swap the CMD to `pnpm --filter @lattice/realtime start`
# after a `pnpm --filter @lattice/realtime build`.
# ────────────────────────────────────────────────────────────────────────────

FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /repo

# Copy the lockfile + every workspace manifest so pnpm can resolve
# the full dep graph before we ship source code.
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/realtime/package.json ./apps/realtime/
COPY apps/web/package.json ./apps/web/

# Pre-fetch all deps (monorepo-wide). This layer is cached unless a
# manifest changes.
RUN pnpm install --frozen-lockfile --filter "@lattice/realtime..."

# Now copy the actual source.
COPY apps/realtime ./apps/realtime
COPY tsconfig.base.json ./

# Build the realtime server.
WORKDIR /repo/apps/realtime
RUN pnpm run build

# ─── Runtime stage ──────────────────────────────────────────────────────
FROM node:22-alpine AS runtime
RUN corepack enable
WORKDIR /repo

# Bring over the installed deps + built output.
COPY --from=base /repo /repo
ENV NODE_ENV=production

EXPOSE 1234

# Default to dev mode (tsx watch). Override CMD in production.
CMD ["pnpm", "--filter", "@lattice/realtime", "dev"]
