# LATTICE

> Next-generation visual website builder. **62 first-party free themes at GA · 500 by Year 1 · multiplayer editing · agentic commerce · WCAG 2.2 AA · Lighthouse 95+ p50.**

This monorepo hosts the editor runtime, the theme engine, the design-token substrate, and (eventually) the marketplace. See [`CLAUDE.md`](./CLAUDE.md) for the full engineering context, design laws, and 204-task roadmap.

---

## Repository layout

```
lattice/
├── apps/
│   └── web/                 # Next.js App Router — the editor + runtime
├── src/                     # Shared libraries (consumed by apps/web via @lattice/*)
│   ├── types/               # Inferred Zod types (Skill 3)
│   ├── engine/theme/        # Zod theme schema + generator (Task 1.17 / 2.26)
│   ├── crdt/                # Yjs document substrate (Task 1.1)
│   ├── commerce/            # Stripe + LATTICE Pay (Skill 4 — never imported into Yjs)
│   ├── blocks/              # Block registry (Task 1.2)
│   ├── tokens/              # W3C Design Tokens — source of truth (Task 1.18)
│   └── themes/              # Theme bundles (P3+)
├── packages/                # Shared packages (ui-kit, config, tsconfig)
├── docker/                  # docker-compose init scripts (Postgres extensions)
├── docker-compose.yml       # Local Postgres (54322) + Redis (6379)
├── docs/                    # 204-task implementation plan
├── .env.example             # Required env vars
├── .husky/                  # Pre-commit hooks
├── eslint.config.mjs        # ESLint (next/core-web-vitals)
├── .prettierrc.json         # Prettier
├── tsconfig.base.json       # Shared strict TS config
├── pnpm-workspace.yaml      # pnpm workspaces (apps/*, packages/*)
└── package.json             # Workspace root
```

---

## Quickstart

Prerequisites: **Node ≥ 20** and **pnpm ≥ 9**.

```bash
# 1. Install all workspace dependencies (root + apps + packages)
pnpm install

# 2. Copy env template and fill in real values
cp .env.example .env.local

# 3. Start the local stack (Postgres on :54322, Redis on :6379)
docker compose up -d

# 4. Start the dev server
pnpm dev
```

`pnpm dev` runs `next dev` inside `apps/web`. Open <http://localhost:3000>.

### Local stack (Docker Compose)

| Service  | Port  | Image                | Notes                                                               |
| -------- | ----- | -------------------- | ------------------------------------------------------------------- |
| postgres | 54322 | `postgres:16-alpine` | Port matches `DATABASE_URL` in `.env.example` (Supabase-CLI style). |
| redis    | 6379  | `redis:7-alpine`     | AOF persistence, healthcheck-gated. Reserved for Phase 2+ features. |

Stop and remove the stack with `docker compose down`. Wipe the data volumes with `docker compose down -v`.

### Workspace-wide commands

| Command              | What it does                             |
| -------------------- | ---------------------------------------- |
| `pnpm dev`           | Start `apps/web` in dev mode             |
| `pnpm build`         | Build every workspace package            |
| `pnpm lint`          | Lint every workspace package             |
| `pnpm typecheck`     | TypeScript check every workspace package |
| `pnpm test`          | Run Vitest once (CI mode)                |
| `pnpm test:watch`    | Vitest in watch mode                     |
| `pnpm test:ui`       | Vitest with the interactive UI           |
| `pnpm test:coverage` | Vitest with V8 coverage report           |
| `pnpm format`        | Prettier-write across the repo           |
| `pnpm format:check`  | Prettier-check (used in CI)              |

### Per-app test commands (`apps/web`)

| Command                                    | What it does            |
| ------------------------------------------ | ----------------------- |
| `pnpm --filter @lattice/web test`          | Single Vitest run       |
| `pnpm --filter @lattice/web test:watch`    | Vitest watch mode       |
| `pnpm --filter @lattice/web test:ui`       | Vitest interactive UI   |
| `pnpm --filter @lattice/web test:coverage` | Vitest with V8 coverage |

### Importing shared libraries from `apps/web`

The `apps/web` tsconfig maps `@lattice/*` to `../../src/*`. So:

```ts
import { LatticeDoc } from "@lattice/crdt/LatticeDoc";
import type { Theme } from "@lattice/types/LatticeTypes";
```

---

## Engineering ground rules (full text in `CLAUDE.md`)

1. **Yjs for all persistent state** — never `useState` for document data.
2. **Tokens, never hex** — every color, font, spacing is a CSS variable.
3. **Zod at every API boundary** — TypeScript types are inferred, not hand-written.
4. **Headless commerce** — Stripe never imports the Yjs layer.
5. **Conventional commits** — `feat(theme): …`, `fix(editor): …`, `chore(infra): …`.

---

## Environment variables

See [`.env.example`](./.env.example) for the full list (Database, WebSocket, Pexels, Supabase, Stripe). Copy to `.env.local` and fill in real keys.

---

## Pre-commit

Husky runs `lint-staged` on every commit: Prettier + ESLint with `--fix --max-warnings 0`. Skip locally with `git commit --no-verify` (not recommended).

## CI

`.github/workflows/ci.yml` runs `pnpm install` → `lint` → `typecheck` → `test` → `build` on every push and PR to `main`. Same gate as a maintainer runs locally.
