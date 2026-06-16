/**
 * Sanity test — exercises a known Zod / Yjs / React-free code path
 * to prove the Vitest toolchain (Vite + Node + TS path aliases) is
 * wired correctly. This file is the first one Vitest runs and the
 * one the developer can `pnpm test` to confirm a fresh checkout.
 */
import { describe, it, expect } from "vitest";
import * as Y from "yjs";

import { BlockType } from "@/blocks/BlockSchema";

describe("vitest toolchain", () => {
  it("loads TypeScript and the Yjs module", () => {
    expect(typeof Y.Doc).toBe("function");
  });

  it("resolves the @/* path alias", () => {
    // BlockType is a Zod enum. The import would fail at module-load
    // time if the path alias were misconfigured.
    expect(BlockType).toBeDefined();
    // Sanity-check it's actually a Zod enum (has a `.enum` property).
    expect(typeof BlockType.enum).toBe("object");
  });
});
