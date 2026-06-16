/**
 * LATTICE Realtime Server — Auth (Task 1.5)
 * ──────────────────────────────────────────
 * Verifies the Supabase-issued JWT that the client passes on the
 * WebSocket upgrade. Returns a `UserContext` on success, `null` on
 * any verification failure.
 *
 * Why HS256 + jsonwebtoken
 *   Supabase issues JWTs signed with the project's JWT secret using
 *   the HS256 algorithm (same family as Auth0 / Firebase). Verifying
 *   with a Node-side `jsonwebtoken` call is the canonical path —
 *   no Supabase HTTP round-trip, no rate limits, microsecond latency.
 *
 * Security notes
 *   - We deliberately do NOT trust tokens in the URL query string
 *     long-term; the current `?token=...` shape is fine for a dev
 *     server but a production deployment should prefer a short-lived
 *     ticket exchanged over HTTPS, then a cookie bound to the WS
 *     handshake. Documented in CLAUDE.md follow-up work.
 *   - We accept ONLY HS256 (Supabase's default). RS256 with a JWKS
 *     endpoint is a Supabase-pro option we don't enable here.
 */
import jwt from "jsonwebtoken";
import type { Config } from "./config.js";

export interface UserContext {
  /** Supabase user id (`sub` claim). Stable across logins. */
  userId: string;
  /** User email — used as the default awareness display name. */
  email: string;
  /** Token expiry (seconds since epoch). Useful for refresh logic later. */
  expiresAt: number;
}

/**
 * Verify a Supabase JWT against the configured secret.
 *
 * @param token  - The raw JWT string (no `Bearer ` prefix).
 * @param config - Loaded server config (provides the secret).
 * @returns      A `UserContext` on success, `null` on any failure
 *                (signature mismatch, expired, malformed claims).
 */
export function verifySupabaseToken(token: string, config: Config): UserContext | null {
  if (!token) return null;

  try {
    // `algorithms` is locked to HS256 — prevents the classic `alg: none`
    // attack and rejects RS256 tokens (which would need a JWKS lookup).
    const decoded = jwt.verify(token, config.supabaseJwtSecret, {
      algorithms: ["HS256"],
      // Supabase tokens include `sub` (user id) and `email`. We don't
      // pin an `audience` because Supabase uses a single audience
      // ("authenticated") and pinning it would be redundant given
      // the shared-secret check.
    });

    if (typeof decoded !== "object" || decoded === null) return null;

    // Supabase-issued tokens always have `sub` (user id) and `email`.
    // Both are strings; coerce defensively.
    const sub = (decoded as Record<string, unknown>)["sub"];
    const email = (decoded as Record<string, unknown>)["email"];
    const exp = (decoded as Record<string, unknown>)["exp"];

    if (typeof sub !== "string" || sub.length === 0) return null;
    if (typeof email !== "string" || email.length === 0) return null;
    if (typeof exp !== "number") return null;

    return { userId: sub, email, expiresAt: exp };
  } catch {
    // jwt.verify throws on every failure mode (expired, bad signature,
    // malformed, wrong algorithm). We collapse them all to `null` —
    // the caller logs the reason at the network boundary, not here.
    return null;
  }
}

/**
 * Extract the JWT from a request. Currently only supports the
 * `?token=...` query param. Future: `Sec-WebSocket-Protocol` header.
 */
export function extractTokenFromUrl(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl, "http://localhost");
    const token = url.searchParams.get("token");
    return token && token.length > 0 ? token : null;
  } catch {
    return null;
  }
}
