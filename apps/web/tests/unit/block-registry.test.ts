/**
 * BlockRegistry unit tests (Task 1.2)
 * ─────────────────────────────────────
 * Verifies the registry:
 *   1. Validates a definition through the Zod schema (Skill 3).
 *   2. Rejects duplicate registrations.
 *   3. Returns a Y.Map instance with the right type + default props on
 *      `createInstance()`.
 *   4. Snapshots a Y.Map block back to a plain object that passes
 *      `BlockSchema`.
 *
 * Skill 1 (CRDT) is exercised here — the test runs entirely against
 * `Y.Doc` / `Y.Map` with no React involved.
 *
 * Yjs integration note
 *   `Y.Map` instances created with `new Y.Map()` are *detached* — they
 *   hold values locally but warn on read until they're integrated into
 *   a doc (e.g. by pushing them into a Y.Array that lives on the doc).
 *   The tests below mirror the production usage pattern: every block
 *   that gets read back is first pushed into `doc.getArray(...)`.
 */
import { describe, it, expect, beforeEach } from "vitest";
import * as Y from "yjs";

import { BlockRegistry } from "@/blocks/BlockRegistry";
import {
  BlockDefinition,
  BlockDefinitionSchema,
  BlockSchema,
  BlockType,
} from "@/blocks/BlockSchema";
import { z } from "zod";
describe("BlockRegistry", () => {
  let doc: Y.Doc;
  let registry: BlockRegistry;
  /** A Y.Array attached to the doc — used to integrate blocks so the
   *  library lets us read their fields back without warnings. */
  let blocksArray: Y.Array<Y.Map<unknown>>;

  beforeEach(() => {
    doc = new Y.Doc();
    registry = new BlockRegistry(doc);
    blocksArray = doc.getArray<Y.Map<unknown>>("test-blocks");
  });

  it("registers a valid block definition", () => {
    const def: BlockDefinition = BlockDefinitionSchema.parse({
      type: "hero",
      displayName: "Hero",
      category: "content",
      description: "A page-level hero",
      propsSchema: z.object({
        title: z.string().default(""),
      }),
      defaultProps: { title: "Hello" },
    });
    registry.register(def);
    expect(registry.has("hero")).toBe(true);
    expect(registry.get("hero")?.displayName).toBe("Hero");
  });

  it("rejects duplicate registration", () => {
    const def: BlockDefinition = BlockDefinitionSchema.parse({
      type: "text",
      displayName: "Text",
      category: "content",
      propsSchema: z.object({ content: z.string().default("") }),
      defaultProps: { content: "" },
    });
    registry.register(def);
    expect(() => registry.register(def)).toThrowError(/already registered/);
  });

  it("createInstance returns a Y.Map with merged defaults", () => {
    const def: BlockDefinition = BlockDefinitionSchema.parse({
      type: "cta",
      displayName: "Call to action",
      category: "content",
      propsSchema: z.object({
        label: z.string().default("Get started"),
        href: z.string().default("#"),
      }),
      defaultProps: { label: "Get started", href: "#" },
    });
    registry.register(def);
    const block = registry.createInstance("cta", { href: "/signup" });

    // Integrate the block into the doc before reading — mirrors how
    // SiteTree.addBlock uses the result.
    blocksArray.push([block]);

    expect(block).toBeInstanceOf(Y.Map);
    expect(block.get("type")).toBe<BlockType>("cta");
    const props = block.get("props") as Y.Map<unknown>;
    expect(props.get("label")).toBe("Get started");
    expect(props.get("href")).toBe("/signup");
  });

  it("validateBlock round-trips a fresh instance through BlockSchema", () => {
    const def: BlockDefinition = BlockDefinitionSchema.parse({
      type: "image",
      displayName: "Image",
      category: "content",
      propsSchema: z.object({
        src: z.string().default(""),
        alt: z.string().default(""),
      }),
      defaultProps: { src: "", alt: "" },
    });
    registry.register(def);
    const block = registry.createInstance("image", {
      src: "/cat.jpg",
      alt: "A tabby cat",
    });
    // Integrate before validation — the schema reads from the live Y.Map.
    blocksArray.push([block]);

    const result = registry.validateBlock(block);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);

    // Round-trip the snapshot back through the schema directly.
    const snapshot = JSON.parse(JSON.stringify(block.toJSON()));
    expect(BlockSchema.safeParse(snapshot).success).toBe(true);
  });
});
