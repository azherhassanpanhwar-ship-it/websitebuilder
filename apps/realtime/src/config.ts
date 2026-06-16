/**
 * LATTICE Realtime Server — Config (Task 1.5)
 * ──────────────────────────────────────────────
 * Centralized env-var parsing. Every env var the server consumes
 * comes through here so:
 *   - a missing or malformed value fails loudly at boot (not at the
 *     first client connection);
 *   - the entire runtime config is type-safe and discoverable from
 *     one file;
 *   - Skill 3 (Zod at every boundary) is honoured.
 *
 * The server is a long-lived process, so we deliberately keep the
 * config parsing strict — no silent defaults for the JWT secret, no
 * "trust the caller" fallbacks.
 */
import { z } from "zod";

const ConfigSchema = z.object({
  /** Port the WS server listens on. Matches NEXT_PUBLIC_WS_URL in apps/web. */
  port: z.coerce.number().int().positive().default(1234),
  /**
   * Hostname to bind. 0.0.0.0 in Docker, 127.0.0.1 locally is fine
   * but we default to 0.0.0.0 so `docker compose up` works.
   */
  host: z.string().default("0.0.0.0"),
  /**
   * HS256 secret used to verify Supabase-issued JWTs. Comes from the
   * Supabase project's `Settings → API → JWT Secret` (or `SUPABASE_JWT_SECRET`
   * env var when using the Supabase CLI locally).
   */
  supabaseJwtSecret: z
    .string()
    .min(32, "SUPABASE_JWT_SECRET must be ≥ 32 chars (Supabase issues HS256 secrets)"),
  /**
   * Comma-separated list of origins allowed to open WS connections.
   * Prevents random websites from consuming your realtime bandwidth.
   */
  allowedOrigins: z.array(z.string()).default(["http://localhost:3000", "http://127.0.0.1:3000"]),
  /** How often to ping idle connections (ms). y-websocket handles the actual keepalive. */
  pingIntervalMs: z.coerce.number().int().positive().default(30_000),
  /** Max payload size in bytes; default 1 MiB is plenty for a Y.Doc update. */
  maxPayloadBytes: z.coerce.number().int().positive().default(1_048_576),
});

export type Config = z.infer<typeof ConfigSchema>;

/** Parse + validate the process env. Throws ZodError on misconfiguration. */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const allowedOriginsRaw = env.ALLOWED_ORIGINS;
  const parsed = ConfigSchema.parse({
    port: env.PORT,
    host: env.HOST,
    supabaseJwtSecret: env.SUPABASE_JWT_SECRET,
    allowedOrigins: allowedOriginsRaw
      ? allowedOriginsRaw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : undefined,
    pingIntervalMs: env.PING_INTERVAL_MS,
    maxPayloadBytes: env.MAX_PAYLOAD_BYTES,
  });
  return parsed;
}
