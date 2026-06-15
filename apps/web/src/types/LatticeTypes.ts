/**
 * LATTICE inferred types
 * ──────────────────────
 * All shared TypeScript types for the LATTICE codebase.
 *
 * Skill 3 — Zod Schema Validation
 *   "TypeScript types are inferred from Zod schemas — never defined separately."
 *
 *   This file re-exports `z.infer` types from the theme engine modules
 *   that exist on this branch. ThemeSchema's types (palette names, font
 *   pairings, the full `Theme` Zod schema) live on PR #4 and are re-merged
 *   once that lands on `main`.
 *
 *   Switcher + Customizer types are re-exported from src/engine/theme/.
 *   Do NOT redeclare any of them.
 */

// ─── Theme Switcher types (Task 2.27) ──────────────────────────────────────

export type {
  ThemeSwitcherOptions,
  ThemeLike,
  BlockMigrationEntry,
  MigrationReport,
} from "../engine/theme/ThemeSwitcher";
export { switchTheme } from "../engine/theme/ThemeSwitcher";

// ─── Theme Customizer types (Task 2.28) ───────────────────────────────────

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
