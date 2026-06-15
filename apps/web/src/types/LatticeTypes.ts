/**
 * LATTICE inferred types
 * ──────────────────────
 * All shared TypeScript types for the LATTICE codebase.
 *
 * Skill 3 — Zod Schema Validation
 *   "TypeScript types are inferred from Zod schemas — never defined separately."
 *
 *   Theme types are re-exported here from src/engine/theme/ThemeSchema.ts.
 *   Generator types are re-exported here from src/engine/theme/ThemeGenerator.ts.
 *   Block types are re-exported from src/blocks/BlockSchema.ts.
 *   Site-tree types are re-exported from src/crdt/SiteTree.ts.
 *   Command-bus types are re-exported from src/commands/CommandBus.ts.
 *   Switcher / Customizer types from src/engine/theme/.
 *   Do NOT redeclare any of them.
 */

// ─── Theme types (inferred from Zod — do not redefine) ─────────────────────

export type {
  TokenRef,
  TokenRefOrLiteral,
  ColorSettings,
  FontFamily,
  FontWeight,
  TypographySettings,
  LayoutDensity,
  SpacingSettings,
  ShadowStyle,
  ShadowSettings,
  HeroPattern,
  HeaderStyle,
  FooterStyle,
  HeroSettings,
  HeaderSettings,
  FooterSettings,
  AnimationStyle,
  AnimationSettings,
  ThemeSettings,
  ThemePreset,
  ThemeCategory,
  DesignStyle,
  ColorMood,
  ThemeMetadata,
  Theme,
} from "../engine/theme/ThemeSchema";

// ─── Theme generator types (Task 2.26) ─────────────────────────────────────

export type {
  PaletteName,
  TypographyPairingName,
  SpacingScale,
  CornerRadius,
  AnimationStylePreset,
  ThemeGeneratorParameters,
} from "../engine/theme/ThemeSchema";

export type { ThemeGeneratorOutput, TokensDoc } from "../engine/theme/ThemeGenerator";
export { generateTheme } from "../engine/theme/ThemeGenerator";

// ─── CRDT / document types (re-exported for convenience) ────────────────────

export type {
  BlockType as LatticeBlockType,
  SectionLayout as LatticeSectionLayout,
  BlockPropValue,
  PageSnapshot,
  SectionSnapshot,
  BlockSnapshot,
} from "../crdt/LatticeDoc";

// ─── Block registry types (inferred from Zod — do not redefine) ────────────

export type {
  BlockType,
  BlockProps,
  Block,
  BlockDefinition,
  BlockValidationResult,
} from "../blocks/BlockSchema";

// ─── Site tree types (re-exported for convenience) ─────────────────────────

export type { PageMeta, Page, Section, BlockInstance, SectionLayout } from "../crdt/SiteTree";

// ─── Command bus types ────────────────────────────────────────────────────

export type { Command, CommandListener } from "../commands/CommandBus";
export {
  CommandBus,
  AddBlockCommand,
  RemoveBlockCommand,
  UpdateBlockPropsCommand,
} from "../commands/CommandBus";

// ─── Theme Switcher types (Task 2.27) ──────────────────────────────────────

export type {
  ThemeSwitcherOptions,
  ThemeLike,
  BlockMigrationEntry,
  MigrationReport,
} from "../engine/theme/ThemeSwitcher";
export { switchTheme } from "../engine/theme/ThemeSwitcher";

// ─── Theme Customizer types (Task 2.28) ────────────────────────────────────

export type {
  OverrideMap,
  OverrideEntry,
  CustomizerBase,
  CssValue,
  CustomizerListener,
} from "../engine/theme/ThemeCustomizer";
export {
  OverrideMapSchema,
  OverrideEntrySchema,
  CssKeySchema,
  CssValueSchema,
  CUSTOMIZER_OVERRIDES_KEY,
  ThemeCustomizer,
} from "../engine/theme/ThemeCustomizer";

// ─── LATTICE-wide branded ids (compile-time safety) ────────────────────────

declare const __brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [__brand]: B };

export type PageId = Brand<string, "PageId">;
export type SectionId = Brand<string, "SectionId">;
export type BlockId = Brand<string, "BlockId">;
export type ThemeId = Brand<string, "ThemeId">;
export type PresetId = Brand<string, "PresetId">;
export type SiteId = Brand<string, "SiteId">;

// ─── Editor mode ────────────────────────────────────────────────────────────

export type EditorMode = "edit" | "preview" | "publish";

// ─── Theme catalog version (matches the metadata.version field) ──────────────

/** Bump on every non-backwards-compatible change to ThemeSchema. */
export const THEME_SCHEMA_VERSION = "1.0.0" as const;
export type ThemeSchemaVersion = typeof THEME_SCHEMA_VERSION;
