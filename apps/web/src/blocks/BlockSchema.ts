/**
 * LATTICE Block Schema (Task 1.2)
 * ───────────────────────────────
 * The Zod schemas for the block catalog and individual block instances.
 *
 * Skill 1 — CRDT Architecture
 *   Block *definitions* (this catalog) are normal TypeScript modules.
 *   Block *instances* live as Y.Map / Y.Array shared types — see
 *   `BlockRegistry.createInstance`.
 *
 * Skill 3 — Zod Schema Validation
 *   Every block boundary uses a Zod schema:
 *     - `BlockDefinitionSchema` validates what callers pass to `register()`
 *     - `BlockSchema` validates the snapshot of a block before it leaves
 *       the CRDT substrate (e.g. before publishing or sending over the wire)
 *     - `BlockPropsSchema` is the loose per-block prop bag — type-specific
 *       shape is enforced by the block's own `propsSchema` at registration
 *       time.
 *
 * Recursive children: handled via `z.lazy()` so a Block can contain nested
 * Blocks (e.g. a column layout that contains cards). The Zod 4 type-only
 * alias `Block` is what TypeScript consumers see; the runtime schema is
 * `BlockSchema`.
 */

import { z } from "zod";

// ─── Discriminator ──────────────────────────────────────────────────────────

/** Built-in block kinds the runtime can render. Themes may extend. */
export const BlockType = z.enum([
  "text",
  "image",
  "hero",
  "header",
  "footer",
  "gallery",
  "video",
  "form",
  "menu",
  "reservation",
  "product-card",
  "cart",
  "checkout",
  "testimonial",
  "faq",
  "cta",
  "embed",
  "custom",
]);
export type BlockType = z.infer<typeof BlockType>;

// ─── Per-block prop bag ─────────────────────────────────────────────────────

/**
 * Loose per-block props. The actual shape is determined by the block's
 * registered `propsSchema` — this is just the bag every block carries.
 */
export const BlockPropsSchema = z.record(z.string(), z.unknown());
export type BlockProps = z.infer<typeof BlockPropsSchema>;

// ─── Block instance (recursive) ─────────────────────────────────────────────

/**
 * TypeScript shape of a block. The runtime Zod schema is `BlockSchema`
 * (declared below) — kept as a `z.ZodType<Block>` so the recursive
 * `children` field type-checks.
 */
export interface Block {
  id: string;
  type: BlockType;
  props: BlockProps;
  children?: Block[];
}

/**
 * Runtime Zod validator for a block. The `z.lazy()` indirection is the
 * only correct way to express self-referential schemas in Zod 4.
 */
export const BlockSchema: z.ZodType<Block> = z.lazy(() =>
  z
    .object({
      id: z.string().min(1, "block.id must be non-empty"),
      type: BlockType,
      props: BlockPropsSchema,
      children: z.array(BlockSchema).optional(),
    })
    .strict(),
);

// ─── Block definition (catalog entry) ───────────────────────────────────────

/**
 * A block *definition* is the static catalog entry the editor shows in the
 * block picker. It bundles a Zod schema for the block's props + sensible
 * defaults + display metadata. The `propsSchema` is intentionally typed as
 * `z.ZodTypeAny` — the concrete schema is supplied by the registering
 * module and re-validated when an instance is created.
 */
export const BlockDefinitionSchema = z
  .object({
    type: BlockType,
    displayName: z.string().min(1).max(64),
    category: z
      .enum(["layout", "content", "media", "commerce", "form", "social", "embed"])
      .default("content"),
    description: z.string().max(280).optional(),
    /** Lucide-react icon name (Skill 5 — single icon system). */
    icon: z.string().min(1).max(64).optional(),
    /**
     * Schema for the block's props. Stored as a function reference (Zod
     * schemas are callable), validated against `BlockPropsSchema` shape at
     * instance creation time. Declared as `z.ZodTypeAny` to keep this
     * schema simple — the actual shape is the registered schema.
     */
    propsSchema: z.any(),
    /** Default values applied to a new instance, merged with overrides. */
    defaultProps: BlockPropsSchema,
  })
  .strict();
export type BlockDefinition = z.infer<typeof BlockDefinitionSchema>;

// ─── Result envelope (for boundary crossings) ───────────────────────────────

export const BlockValidationResult = z.object({
  valid: z.boolean(),
  errors: z.array(z.string()),
});
export type BlockValidationResult = z.infer<typeof BlockValidationResult>;
