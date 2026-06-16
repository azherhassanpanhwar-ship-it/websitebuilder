/**
 * Vitest global setup
 * ────────────────────
 * Loaded before every test file (configured in `vitest.config.ts`).
 *
 * Currently registers `@testing-library/jest-dom` matchers so component
 * tests can use `expect(el).toBeInTheDocument()` etc. Substrate tests
 * (CRDT, schemas, command bus) don't need it but it costs nothing to
 * load globally.
 */
import "@testing-library/jest-dom/vitest";
