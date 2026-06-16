/**
 * Config unit tests (Task 1.5)
 * ────────────────────────────
 * The config module is the single chokepoint for env-var parsing — if
 * it silently accepts bad input, the server boots in an invalid state
 * and the first client connection is the moment we find out. These
 * tests pin the strict-Zod behavior.
 */
import { describe, it, expect } from "vitest";
import { loadConfig } from "./config";

describe("loadConfig", () => {
  it("rejects when SUPABASE_JWT_SECRET is missing", () => {
    expect(() => loadConfig({})).toThrow();
  });

  it("rejects when SUPABASE_JWT_SECRET is too short", () => {
    expect(() => loadConfig({ SUPABASE_JWT_SECRET: "short" })).toThrow(/≥ 32/);
  });

  it("accepts a minimal valid env and applies defaults", () => {
    const cfg = loadConfig({ SUPABASE_JWT_SECRET: "x".repeat(64) });
    expect(cfg.port).toBe(1234);
    expect(cfg.host).toBe("0.0.0.0");
    expect(cfg.allowedOrigins).toEqual(["http://localhost:3000", "http://127.0.0.1:3000"]);
    expect(cfg.pingIntervalMs).toBe(30_000);
    expect(cfg.maxPayloadBytes).toBe(1_048_576);
  });

  it("parses a comma-separated ALLOWED_ORIGINS list", () => {
    const cfg = loadConfig({
      SUPABASE_JWT_SECRET: "x".repeat(64),
      ALLOWED_ORIGINS: "https://app.lattice.dev, https://staging.lattice.dev",
    });
    expect(cfg.allowedOrigins).toEqual(["https://app.lattice.dev", "https://staging.lattice.dev"]);
  });

  it("coerces PORT and PING_INTERVAL_MS from strings", () => {
    const cfg = loadConfig({
      SUPABASE_JWT_SECRET: "x".repeat(64),
      PORT: "8080",
      PING_INTERVAL_MS: "10000",
    });
    expect(cfg.port).toBe(8080);
    expect(cfg.pingIntervalMs).toBe(10_000);
  });

  it("rejects non-positive PORT", () => {
    expect(() => loadConfig({ SUPABASE_JWT_SECRET: "x".repeat(64), PORT: "0" })).toThrow();
    expect(() => loadConfig({ SUPABASE_JWT_SECRET: "x".repeat(64), PORT: "-1" })).toThrow();
  });
});
