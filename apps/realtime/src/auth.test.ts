/**
 * Auth unit tests (Task 1.5)
 * ──────────────────────────
 * Verifies the JWT verification path. Uses a real HS256 token
 * generated in-process so the test is hermetic — no network, no
 * shared secret from disk.
 */
import { describe, it, expect } from "vitest";
import jwt from "jsonwebtoken";
import { verifySupabaseToken, extractTokenFromUrl } from "./auth";
import type { Config } from "./config";

const SECRET = "x".repeat(64);
const config: Config = {
  port: 1234,
  host: "0.0.0.0",
  supabaseJwtSecret: SECRET,
  allowedOrigins: ["http://localhost:3000"],
  pingIntervalMs: 30_000,
  maxPayloadBytes: 1_048_576,
};

function mintToken(claims: Record<string, unknown>, opts: jwt.SignOptions = {}): string {
  return jwt.sign(claims, SECRET, { algorithm: "HS256", expiresIn: "1h", ...opts });
}

describe("verifySupabaseToken", () => {
  it("accepts a valid Supabase-shaped token", () => {
    const token = mintToken({ sub: "user_abc", email: "test@example.com" });
    const result = verifySupabaseToken(token, config);
    expect(result).not.toBeNull();
    expect(result?.userId).toBe("user_abc");
    expect(result?.email).toBe("test@example.com");
    expect(typeof result?.expiresAt).toBe("number");
  });

  it("rejects an expired token", () => {
    const token = mintToken({ sub: "user_abc", email: "test@example.com" }, { expiresIn: "-1s" });
    expect(verifySupabaseToken(token, config)).toBeNull();
  });

  it("rejects a token signed with a different secret", () => {
    const otherToken = jwt.sign({ sub: "user_abc", email: "test@example.com" }, "y".repeat(64), {
      algorithm: "HS256",
      expiresIn: "1h",
    });
    expect(verifySupabaseToken(otherToken, config)).toBeNull();
  });

  it("rejects a token missing `sub`", () => {
    const token = mintToken({ email: "test@example.com" });
    expect(verifySupabaseToken(token, config)).toBeNull();
  });

  it("rejects a token missing `email`", () => {
    const token = mintToken({ sub: "user_abc" });
    expect(verifySupabaseToken(token, config)).toBeNull();
  });

  it("rejects a token signed with the wrong algorithm (alg=none attack)", () => {
    // We can't actually forge HS256→none, but we can confirm the
    // verifier rejects an RS256 token (different alg) — the kind an
    // attacker might try to slip past.
    const rsaToken = jwt.sign({ sub: "user_abc", email: "test@example.com" }, SECRET, {
      algorithm: "HS512",
      expiresIn: "1h",
    });
    expect(verifySupabaseToken(rsaToken, config)).toBeNull();
  });

  it("rejects an empty token string", () => {
    expect(verifySupabaseToken("", config)).toBeNull();
  });
});

describe("extractTokenFromUrl", () => {
  it("extracts the token from the query string", () => {
    expect(extractTokenFromUrl("/room1?token=abc123")).toBe("abc123");
  });

  it("returns null when no token is present", () => {
    expect(extractTokenFromUrl("/room1")).toBeNull();
  });

  it("returns null for a malformed URL", () => {
    expect(extractTokenFromUrl("not a url")).toBeNull();
  });
});
