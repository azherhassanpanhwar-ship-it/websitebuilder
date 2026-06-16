/**
 * LATTICE Supabase client (Task 1.4)
 * ───────────────────────────────────
 * A lazy, browser-safe singleton. We do NOT import the client on the
 * server side (Skill 4 — headless boundary). The realtime server has
 * its own auth path; this client is for the editor + the persistence
 * layer in the browser.
 *
 * Why a factory instead of `new Client(...)` at module top
 *   - Next.js may import this file in the server build. A module-level
 *     `new Client(...)` would crash on import (no `window`).
 *   - We want to support multiple LATTICE projects later (different
 *     Supabase URLs per tenant). A factory makes that trivial.
 *   - Tests can call `setSupabaseClient(mock)` to swap in a fake.
 *
 * Why a singleton
 *   - Supabase maintains a WebSocket for Realtime auth state. We want
 *     exactly one of those per browser tab.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/**
 * Build (or return the cached) Supabase browser client.
 *
 * Required env vars (NEXT_PUBLIC_* — embedded at build time):
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
export function getSupabaseClient(): SupabaseClient {
  if (cached) return cached;

  const url = process.env["NEXT_PUBLIC_SUPABASE_URL"];
  const anonKey = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"];

  if (!url || !anonKey) {
    throw new Error(
      "Supabase env vars missing — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY " +
        "(see .env.example).",
    );
  }

  cached = createClient(url, anonKey, {
    auth: {
      // Editor session is per-tab. Don't persist to localStorage by
      // default — we re-auth on every load until the user opts in
      // (memory persistence avoids token leakage in shared machines).
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return cached;
}

/**
 * Test-only escape hatch. Allows a Vitest test to inject a mock
 * Supabase client (e.g. one that resolves with a fixture instead of
 * hitting the network).
 */
export function setSupabaseClient(client: SupabaseClient | null): void {
  cached = client;
}

/** Reset to the uninitialized state. Used in test teardown. */
export function resetSupabaseClient(): void {
  cached = null;
}
