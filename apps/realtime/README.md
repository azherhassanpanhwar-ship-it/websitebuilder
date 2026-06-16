# @lattice/realtime

Yjs WebSocket server for the LATTICE editor. Hosts multiplayer document
sync + cursor awareness, gated by Supabase JWT auth on the upgrade
handshake.

## Run standalone

```bash
# from the monorepo root
pnpm install
cp .env.example .env.local          # then set SUPABASE_JWT_SECRET
docker compose up -d                # if you also want the local Postgres
pnpm --filter @lattice/realtime dev
```

The server logs:

```
[lattice-realtime] listening on ws://0.0.0.0:1234 (allowed origins: http://localhost:3000, http://127.0.0.1:3000)
```

## Connection protocol

```
ws://localhost:1234/<roomName>?token=<supabase-jwt>
```

- `roomName` is the site id (e.g. `site_abc123`).
- `token` is the Supabase-issued access token from `supabase.auth.getSession()`.
- Origin header must be in `ALLOWED_ORIGINS` (default: `http://localhost:3000`).

Returns `101 Switching Protocols` on success, `401` on missing/invalid token,
`403` on disallowed origin, `400` on missing room name.

## Health check

```bash
curl http://localhost:1234/health
# → { "status": "ok", "service": "lattice-realtime" }
```

## Architecture

The server is a **stateless relay** — it does not own the canonical
document state. Each room's truth lives in the connected clients'
`Y.Doc` instances; the server only broadcasts Y updates between them.

Persistence (Task 1.4) is the browser's job, not the server's. See
`apps/web/src/persistence/` for the Supabase snapshot writer.

## File layout

```
src/
├── server.ts   HTTP + WS listener, graceful shutdown
├── auth.ts     Supabase JWT verification
└── config.ts   Env-var parsing (Zod-validated)
```
