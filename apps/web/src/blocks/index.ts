/**
 * LATTICE Block Components — dispatch table
 * ─────────────────────────────────────────
 * Maps every `BlockType` to the React component the editor renders
 * for it. The BlockRegistry (Task 1.2) is the *catalog* of what block
 * types exist + their prop schemas; this file is the *renderer*
 * table that turns a Yjs block instance into a visible UI tree.
 *
 * Skill 1 — CRDT
 *   Every block in the Y.Doc has a `type` field. The editor reads that
 *   string and looks it up here. The component receives the block's
 *   props (extracted from its `props` Y.Map) and renders accordingly.
 *
 * Skill 3 — Zod at the boundary
 *   Components here are pure presentational — they trust the props
 *   they receive. Type validation happens at the BlockRegistry
 *   instance-creation step (`createInstance()`). The map keys are
 *   structural — `keyof typeof BLOCK_COMPONENTS` is the union of
 *   block types the editor knows how to render.
 *
 * Adding a new block type
 *   1. Add the new BlockType enum value in `BlockSchema.ts`.
 *   2. Create `MyBlock.tsx` next to this file.
 *   3. Add `myType: MyBlock` to `BLOCK_COMPONENTS` below.
 *   4. (Optional) Add default props to the `DEFAULT_PROPS` map in
 *      `BlockRegistry.ts` so the Block Picker previews render
 *      sensibly.
 */

import * as React from "react";

import { HeroBlock, type HeroBlockProps } from "./HeroBlock";
import { HeaderBlock, type HeaderBlockProps } from "./HeaderBlock";
import { FooterBlock, type FooterBlockProps } from "./FooterBlock";
import { TextBlock, type TextBlockProps } from "./TextBlock";
import { ImageBlock, type ImageBlockProps } from "./ImageBlock";
import type { BlockType } from "./BlockSchema";

/**
 * The full prop shape every registered block component receives. The
 * editor extracts the block's props (Y.Map → plain object) and passes
 * them here. Each component cherry-picks the fields it cares about.
 */
export interface BlockComponentProps {
  // The block type discriminator — useful for blocks that handle
  // multiple kinds (none of the base 5 do, but the contract leaves
  // room for it).
  type?: BlockType;
  // A flat string→unknown map. Each component casts the fields it
  // knows about; the rest are ignored.
  [key: string]: unknown;
}

/**
 * Dispatch table. The editor reads `BLOCK_COMPONENTS[block.type]` to
 * find the component, and renders it with the block's props.
 *
 * Every key MUST be a valid `BlockType` (the type-level constraint is
 * enforced at the export below). If you add a new BlockType, also add
 * its renderer here.
 */
export const BLOCK_COMPONENTS = {
  // Headers / footers
  header: HeaderBlock as React.ComponentType<BlockComponentProps>,
  footer: FooterBlock as React.ComponentType<BlockComponentProps>,
  // Heroes
  hero: HeroBlock as React.ComponentType<BlockComponentProps>,
  // Content
  text: TextBlock as React.ComponentType<BlockComponentProps>,
  image: ImageBlock as React.ComponentType<BlockComponentProps>,
  // ─── Other kinds (form, gallery, video, etc.) land in follow-up PRs ───
  gallery: undefined,
  video: undefined,
  form: undefined,
  menu: undefined,
  reservation: undefined,
  "product-card": undefined,
  cart: undefined,
  checkout: undefined,
  testimonial: undefined,
  faq: undefined,
  cta: undefined,
  embed: undefined,
  custom: undefined,
} as const satisfies Partial<Record<BlockType, React.ComponentType<BlockComponentProps> | undefined>>;

/** Component type for any block in the table. */
export type AnyBlockComponent = NonNullable<(typeof BLOCK_COMPONENTS)[BlockType]>;

/** Re-export each component's specific props type for ergonomic consumers. */
export type { HeroBlockProps, HeaderBlockProps, FooterBlockProps, TextBlockProps, ImageBlockProps };
