/// <reference types="vitest" />
/**
 * Vitest config — apps/web
 * ─────────────────────────
 * LATTICE test runner. Mirrors the TypeScript path aliases in
 * `apps/web/tsconfig.json` so test files can import the substrate via the
 * same `@/...` / `@lattice/...` paths the production code uses.
 *
 * Why Vite + React plugin (not Jest)?
 *   - Vitest uses Vite's transform pipeline → near-zero config for
 *     TS/TSX/JSON, instant watch.
 *   - Same toolchain as Next 16 + Turbopack, so what's green in tests is
 *     what ships.
 *   - Native ESM, no Babel. Plays well with `yjs` (which ships ESM).
 *
 * Skill 1 (CRDT) note
 *   Yjs is environment-agnostic — the same `Y.Doc` works in Node, jsdom,
 *   and the browser. The default `node` environment is therefore enough
 *   for substrate tests; only React-component tests opt into `jsdom`.
 */
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    // Run the substrate tests in Node (fast) and the React component
    // tests in jsdom (set per-file via `// @vitest-environment jsdom`).
    environment: "node",
    // Match the same file patterns Next.js picks up, plus a `tests/` dir.
    include: ["src/**/*.{test,spec}.{ts,tsx}", "tests/**/*.{test,spec}.{ts,tsx}"],
    // Global test setup (jest-dom matchers etc.).
    setupFiles: ["./tests/setup.ts"],
    // Reporters — `default` is fine for CI, `verbose` is nicer locally.
    reporters: process.env.CI ? ["default"] : ["default"],
    // Coverage thresholds (Skill 0 — Performance is the product).
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.{test,spec}.{ts,tsx}",
        "src/**/index.ts", // barrel re-exports
        "src/types/**", // type-only files
      ],
    },
  },
  resolve: {
    alias: {
      // Mirror tsconfig.json path aliases so tests can `import` the same
      // way the app does.
      "@": resolve(__dirname, "./src"),
      "@lattice/blocks": resolve(__dirname, "../../src/blocks"),
      "@lattice/crdt": resolve(__dirname, "../../src/crdt"),
      "@lattice/types": resolve(__dirname, "../../src/types"),
      "@lattice/commands": resolve(__dirname, "../../src/commands"),
      "@lattice/editor": resolve(__dirname, "../../src/editor"),
      "@lattice/engine": resolve(__dirname, "../../src/engine"),
      "@lattice/tokens": resolve(__dirname, "../../src/tokens"),
    },
  },
});
