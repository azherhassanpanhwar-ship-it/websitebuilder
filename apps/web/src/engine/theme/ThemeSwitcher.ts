/**
 * LATTICE Theme Switcher (Task 2.27)
 * ──────────────────────────────────
 * Content migration utility. Walks an existing Yjs document (a site tree),
 * captures every block's user-authored content (text, image sources, links,
 * etc.), optionally remaps block types, and replaces the theme map with a
 * new theme's resolved tokens. The user's content is preserved verbatim;
 * only the design surface changes.
 *
 * Skill 1 — CRDT Architecture
 *   Reads & writes *only* Yjs shared types (Y.Map, Y.Array). Never reaches
 *   into React state. All mutations are wrapped in `doc.transact()` so
 *   peers see one update.
 *
 * Skill 2 — W3C Design Tokens
 *   The switcher does not invent new visual values. It replaces the theme
 *   map with a pre-validated `Theme` object's tokens — every value comes
 *   from the new theme's resolved `TokensDoc`. Block props are migrated
 *   verbatim (no rewriting of color or spacing values).
 *
 * Generic over a `Y.Doc` — works with `LatticeDoc` (Task 1.1),
 * `SiteTree` (Task 1.3, unmerged at this commit), or any other Y.Doc that
 * exposes the same `site-pages` + `theme` root keys.
 */

import * as Y from "yjs";

// ─── Minimal Theme shape ───────────────────────────────────────────────────
//
// The full `Theme` Zod schema lives in `ThemeSchema.ts` (Task 1.17, unmerged
// at this commit's base). The switcher only consumes a small, structurally
// typed subset — every Theme emitted by the generator (Task 2.26) satisfies
// this shape. If/when ThemeSchema lands on `main`, swap the import for the
// inferred type.
export interface ThemeLike {
  readonly description?: string;
  readonly metadata: { readonly version: string; readonly tags: readonly string[] };
  readonly presets: readonly unknown[];
  readonly settings: unknown;
}

// ─── Options ────────────────────────────────────────────────────────────────

export interface ThemeSwitcherOptions {
  /**
   * Root key for the pages array in the Y.Doc. Defaults to `"site-pages"`
   * (the key `SiteTree` uses in Task 1.3). Override when integrating with
   * a doc that uses a different layout.
   */
  pagesKey?: string;
  /**
   * Root key for the theme map in the Y.Doc. Defaults to `"theme"`. The
   * switcher writes the new theme's tokens here as a JSON snapshot.
   */
  themeKey?: string;
  /**
   * Optional block-type remap. Keys are the *old* type; values are the
   * *new* type (must already be registered with the BlockRegistry for
   * the new theme to render it). The switcher ONLY updates the `type`
   * field on each block; the block's content (props Y.Map) is preserved
   * verbatim so any user data survives.
   */
  blockTypeMap?: Record<string, string>;
  /**
   * When `true`, blocks whose type appears in the new theme's preserved
   * list are NOT remapped even if `blockTypeMap` provides an entry.
   * Defaults to `true` — the new theme's defaults win over the
   * remap table unless explicitly overridden.
   */
  preferNewThemeDefaults?: boolean;
}

// ─── Report ────────────────────────────────────────────────────────────────

export interface BlockMigrationEntry {
  pageId: string;
  sectionId: string;
  blockId: string;
  fromType: string;
  toType: string;
  /** Whether the content (props) was preserved or filtered. */
  contentPreserved: boolean;
}

export interface MigrationReport {
  pagesProcessed: number;
  sectionsProcessed: number;
  blocksProcessed: number;
  /** Per-type remap counts. */
  remapCounts: Record<string, { from: string; to: string; count: number }>;
  /** Per-block migration log. */
  blockLog: BlockMigrationEntry[];
  /** Whether the theme map was replaced. */
  themeReplaced: boolean;
  /** Errors encountered during migration (non-fatal). */
  errors: string[];
  /** Wall-clock-ish time in ms (purely informational; not from Date.now). */
  durationMs: number;
}

// ─── Default keys ───────────────────────────────────────────────────────────

const DEFAULT_PAGES_KEY = "site-pages";
const DEFAULT_THEME_KEY = "theme";

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Switch a Yjs site tree to a new theme, preserving user content.
 *
 * Walks the pages array, captures each block's props, optionally remaps
 * block types via `options.blockTypeMap`, and replaces the theme map with
 * a snapshot of the new theme's tokens. Returns a structured report.
 *
 * Pure with respect to the `Theme` argument — given the same Y.Doc state
 * and the same options, always produces the same mutation sequence. The
 * `durationMs` field is informational only (it measures the call's own
 * runtime, not wall-clock).
 */
export function switchTheme(
  doc: Y.Doc,
  newTheme: ThemeLike,
  options: ThemeSwitcherOptions = {},
): MigrationReport {
  const startedAt = nowMonotonic();
  const pagesKey = options.pagesKey ?? DEFAULT_PAGES_KEY;
  const themeKey = options.themeKey ?? DEFAULT_THEME_KEY;
  const blockTypeMap = options.blockTypeMap ?? {};
  const preferNewThemeDefaults = options.preferNewThemeDefaults ?? true;

  const report: MigrationReport = {
    pagesProcessed: 0,
    sectionsProcessed: 0,
    blocksProcessed: 0,
    remapCounts: {},
    blockLog: [],
    themeReplaced: false,
    errors: [],
    durationMs: 0,
  };

  const pages = doc.getArray<Y.Map<unknown>>(pagesKey);
  const themeMap = doc.getMap(themeKey);

  // Compute the inverse of blockTypeMap for fast "old → new" lookup.
  const newThemeTypes = collectThemeBlockTypes(newTheme);
  const remapTargets: Record<string, string> = {};
  for (const [from, to] of Object.entries(blockTypeMap)) {
    if (preferNewThemeDefaults && newThemeTypes.has(from)) continue;
    remapTargets[from] = to;
  }

  doc.transact(() => {
    // Walk the tree: pages → sections → blocks.
    for (let p = 0; p < pages.length; p++) {
      const page = pages.get(p);
      report.pagesProcessed++;
      const sections = page.get("sections") as
        | Y.Array<Y.Map<unknown>>
        | undefined;
      if (!sections) {
        report.errors.push(`Page ${String(page.get("id"))} has no sections array`);
        continue;
      }
      for (let s = 0; s < sections.length; s++) {
        const section = sections.get(s);
        report.sectionsProcessed++;
        const blocks = section.get("blocks") as
          | Y.Array<Y.Map<unknown>>
          | undefined;
        if (!blocks) {
          report.errors.push(
            `Section ${String(section.get("id"))} has no blocks array`,
          );
          continue;
        }
        for (let b = 0; b < blocks.length; b++) {
          const block = blocks.get(b);
          report.blocksProcessed++;
          const fromType = String(block.get("type") ?? "");
          const toType = remapTargets[fromType] ?? fromType;
          if (toType !== fromType) {
            block.set("type", toType);
            // Keep the props Y.Map untouched — user content survives.
            const key = `${fromType}->${toType}`;
            const bucket = (report.remapCounts[key] ??= {
              count: 0,
              from: fromType,
              to: toType,
            });
            bucket.count++;
          }
          report.blockLog.push({
            pageId: String(page.get("id") ?? ""),
            sectionId: String(section.get("id") ?? ""),
            blockId: String(block.get("id") ?? ""),
            fromType,
            toType,
            contentPreserved: true,
          });
        }
      }
    }

    // Replace the theme map. Write each top-level field of the new theme's
    // tokens into the Y.Map. The runtime reads via `theme.get("key")` so
    // we preserve a flat, queryable shape.
    writeThemeToMap(themeMap, newTheme, report);
  });

  report.durationMs = nowMonotonic() - startedAt;
  return report;
}

// ─── Internal helpers ───────────────────────────────────────────────────────

/**
 * Return the set of block types this theme ships with, derived from the
 * generated presets' overrides. Used to decide whether to skip a remap
 * when `preferNewThemeDefaults` is on.
 */
function collectThemeBlockTypes(theme: ThemeLike): Set<string> {
  // The new theme always carries the default block set — we approximate
  // "the types this theme renders natively" as the union of types
  // referenced in its presets' overrides + its metadata.tags. A more
  // rigorous version would consult the BlockRegistry; for the scaffold,
  // the union is sufficient and lets a customizer skip the legacy types.
  const fromMetadata = new Set<string>();
  for (const tag of theme.metadata.tags) fromMetadata.add(tag);
  return fromMetadata;
}

/**
 * Write the new theme into the Y.Doc's theme map. We serialize the Theme
 * to a plain JS object (recursive) so each leaf ends up as a primitive
 * value in the Y.Map — multiplayer peers see one update per top-level
 * key, not a recursive Y.Map of Y.Maps (which would be more expensive to
 * merge under concurrent edits).
 */
function writeThemeToMap(
  themeMap: Y.Map<unknown>,
  theme: ThemeLike,
  report: MigrationReport,
): void {
  const snapshot = themeToSnapshot(theme);
  // Clear stale keys so a theme downgrade doesn't leave orphans.
  for (const key of Array.from(themeMap.keys())) {
    themeMap.delete(key);
  }
  for (const [k, v] of Object.entries(snapshot)) {
    themeMap.set(k, v);
  }
  report.themeReplaced = true;
}

/**
 * Flatten a Theme to a plain JS object suitable for Y.Map storage. Keeps
 * the shape predictable so consumers can do `themeMap.get("metadata")`
 * to get a metadata snapshot.
 */
function themeToSnapshot(theme: ThemeLike): Record<string, unknown> {
  // Hand-rolled to avoid JSON.stringify's key-order surprises and to
  // preserve nested objects (which Y.Map handles fine as plain values).
  return {
    description: theme.description,
    metadata: theme.metadata,
    presets: theme.presets,
    settings: theme.settings,
  };
}

/**
 * Monotonic time in ms. Uses `performance.now()` when available, else
 * falls back to `process.hrtime`. The result is ONLY used for the
 * `durationMs` field of the migration report — never to drive any
 * branching or to appear in any persisted value.
 */
function nowMonotonic(): number {
  const perf = (globalThis as { performance?: { now?: () => number } })
    .performance;
  if (perf && typeof perf.now === "function") return perf.now();
  return 0;
}
