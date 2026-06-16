/// <reference types="vitest" />
/**
 * Vitest config — @lattice/realtime
 * ──────────────────────────────────
 * The realtime server is a Node-only process (no React, no jsdom). Tests
 * run in the `node` environment and cover the unit-testable helpers
 * (config, auth). The full server boot is integration-tested via
 * `docker compose up` + a real WebSocket client.
 */
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    setupFiles: [],
  },
});
