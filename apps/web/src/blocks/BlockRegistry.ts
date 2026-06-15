/**
 * LATTICE Block Registry (Task 1.2)
 * ────────────────────────────────
 * A Y.Map-backed catalog of block types. The registry stores the
 * `BlockDefinition` for every block kind the editor can drop into a page
 * and produces live Y.Map block instances on demand.
 *
 * Skill 1 — CRDT Architecture
 *   The registry's *definitions* are plain TypeScript data. The *instances*
 *   it returns are `Y.Map` shared types, ready to be pushed into a Section's
 *   `blocks` Y.Array. No React state involved.
 *
 * Skill 3 — Zod Schema Validation
 *   `register()` validates the incoming definition with `BlockDefinitionSchema`
 *   before accepting it. `validateBlock()` validates a snapshot of any block
 *   instance with `BlockSchema` before it leaves the substrate.
 */

import * as Y from "yjs";
import { createId } from "../crdt/ids";
import {
  Block,
  BlockDefinition,
  BlockDefinitionSchema,
  BlockSchema,
  BlockValidationResult,
} from "./BlockSchema";

// ─── Built-in default registry (the 18 kinds from BlockType) ───────────────

/**
 * Sensible default props per block type. Consumed by `createInstance` when
 * the caller doesn't supply overrides. Per Skill 2 every prop is either a
 * literal value or a `{ ref: "--token-name" }` token reference — never a
 * raw hex / px.
 */
const DEFAULT_PROPS: Record<string, Record<string, unknown>> = {
  text: { content: "", align: "left", size: "md" },
  image: { src: { ref: "--asset-empty" }, alt: "", aspectRatio: "16/9" },
  hero: {
    pattern: "full-bleed-image",
    minHeight: { ref: "--space-11" },
    alignment: "bottom",
  },
  header: {
    style: "transparent-over-hero",
    height: { ref: "--space-8" },
  },
  footer: { style: "expanded", newsletter: false },
  gallery: { columns: 3, gap: { ref: "--space-4" } },
  video: { src: { ref: "--asset-empty" }, poster: { ref: "--asset-empty" } },
  form: { submitLabel: "Submit", fields: [] },
  menu: { layout: "list", sections: [] },
  reservation: { provider: "opentable", restaurantId: "" },
  "product-card": { productId: "", showPrice: true, showCTA: true },
  cart: { showQuantities: true, showCoupons: true },
  checkout: { provider: "stripe" },
  testimonial: { author: "", quote: "" },
  faq: { items: [] },
  cta: { label: "Get started", href: "#", variant: "primary" },
  embed: { provider: "youtube", url: "" },
  custom: {},
};

// ─── The registry class ────────────────────────────────────────────────────

/**
 * Wraps a `Y.Doc` and exposes a typed catalog of block types. Two
 * representations are kept in sync:
 *
 *   - A plain in-memory `Map` for synchronous, type-safe reads (the editor
 *     needs the picker to render synchronously).
 *   - A `Y.Map` of the same data, so the registry is itself multiplayer-
 *     aware — peers can register custom block types and see them appear.
 */
export class BlockRegistry {
  private readonly doc: Y.Doc;
  private readonly registry: Y.Map<unknown>;
  private readonly definitions = new Map<string, BlockDefinition>();

  constructor(doc: Y.Doc) {
    this.doc = doc;
    this.registry = doc.getMap("block-registry");
  }

  // ─── Read ─────────────────────────────────────────────────────────────

  get(type: string): BlockDefinition | undefined {
    return this.definitions.get(type);
  }

  has(type: string): boolean {
    return this.definitions.has(type);
  }

  list(): BlockDefinition[] {
    return Array.from(this.definitions.values());
  }

  listByCategory(): Record<string, BlockDefinition[]> {
    const grouped: Record<string, BlockDefinition[]> = {};
    for (const def of this.definitions.values()) {
      const cat = def.category ?? "content";
      (grouped[cat] ??= []).push(def);
    }
    return grouped;
  }

  // ─── Write ────────────────────────────────────────────────────────────

  /**
   * Register a new block type. Validates the definition with Zod (Skill 3)
   * and writes the definition into the registry Y.Map inside a single
   * transaction so peers see one update.
   */
  register(definition: BlockDefinition): void {
    // Skill 3: every boundary has a Zod schema.
    const validated = BlockDefinitionSchema.parse(definition);
    if (this.definitions.has(validated.type)) {
      throw new Error(`Block type "${validated.type}" is already registered`);
    }
    this.definitions.set(validated.type, validated);
    this.doc.transact(() => {
      this.registry.set(validated.type, validated);
    });
  }

  /**
   * Register a batch of definitions — convenience for app boot.
   */
  registerAll(definitions: BlockDefinition[]): void {
    this.doc.transact(() => {
      for (const def of definitions) this.register(def);
    });
  }

  // ─── Instance factory ─────────────────────────────────────────────────

  /**
   * Create a fresh Y.Map block instance of the given type. The instance
   * is detached — the caller is responsible for pushing it into a
   * Section's `blocks` Y.Array (typically via the Command bus).
   */
  createInstance(
    type: string,
    overrides?: Record<string, unknown>,
  ): Y.Map<unknown> {
    const def = this.definitions.get(type);
    if (!def) {
      throw new Error(
        `Block type "${type}" is not registered. Call register() first.`,
      );
    }
    const defaults = DEFAULT_PROPS[type] ?? def.defaultProps ?? {};
    const merged = { ...defaults, ...def.defaultProps, ...overrides };

    // Validate the merged props against the type-specific schema when one
    // is provided. We use safeParse so a single bad prop doesn't crash the
    // editor — callers can read the result via `validateBlock()` later.
    if (def.propsSchema && typeof def.propsSchema.safeParse === "function") {
      const result = def.propsSchema.safeParse(merged);
      if (!result.success) {
        // Surface a console warning but still build the instance — the
        // Customizer (Task 2.31) will let authors fix invalid props.
        console.warn(
          `[BlockRegistry] Block "${type}" props failed validation:`,
          result.error.issues,
        );
      }
    }

    const block = new Y.Map<unknown>();
    block.set("id", createId("block"));
    block.set("type", type);

    const propsMap = new Y.Map<unknown>();
    for (const [k, v] of Object.entries(merged)) propsMap.set(k, v);
    block.set("props", propsMap);

    block.set("children", new Y.Array<Y.Map<unknown>>());

    return block;
  }

  // ─── Validation ───────────────────────────────────────────────────────

  /**
   * Validate a block instance against the Zod block schema. Returns a
   * structured result so callers (e.g. the publish pipeline) can surface
   * individual errors without throwing.
   */
  validateBlock(block: Y.Map<unknown>): BlockValidationResult {
    const snapshot = this.snapshotBlock(block);
    const result = BlockSchema.safeParse(snapshot);
    if (result.success) return { valid: true, errors: [] };
    return {
      valid: false,
      errors: result.error.issues.map(
        (e) => `${e.path.join(".") || "(root)"}: ${e.message}`,
      ),
    };
  }

  /**
   * Snapshot a Y.Map block (and its nested children) as a plain JS object.
   * This is the shape the Zod schema validates against.
   */
  private snapshotBlock(block: Y.Map<unknown>): Block {
    const children = block.get("children") as
      | Y.Array<Y.Map<unknown>>
      | undefined;
    return {
      id: String(block.get("id") ?? ""),
      type: block.get("type") as Block["type"],
      props: ((block.get("props") as Y.Map<unknown> | undefined)?.toJSON() ??
        {}) as Record<string, unknown>,
      children: children
        ? children.toArray().map((c) => this.snapshotBlock(c))
        : undefined,
    };
  }
}
