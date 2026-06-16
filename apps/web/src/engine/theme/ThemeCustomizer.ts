/**
 * LATTICE Theme Customizer (Task 2.28)
 * ───────────────────────────────────
 * Live per-site token overrides on top of an active theme. The customizer
 * stores every override in a `Y.Map` so multiplayer peers see each
 * tweak in real time (Skill 1). It exposes a `resolvedTokens()` method
 * that deep-merges the base theme's resolved `css` block with the live
 * overrides and returns the merged W3C token set. Components consume
 * the result the same way they consume the base theme's tokens — via
 * `var(--*)`.
 *
 * Skill 1 — CRDT Architecture
 *   The override store IS a `Y.Map`. Subscribing to deep changes lets the
 *   editor re-render the Customizer panel without polling. All writes
 *   go through `set()` / `unset()` / `clear()` which wrap the mutation
 *   in `doc.transact()`.
 *
 * Skill 2 — W3C Design Tokens
 *   Override *values* are CSS-variable references (e.g. `var(--color-
 *   blue-500)`) or concrete dimensions / fonts. The customizer does NOT
 *   hardcode a palette or scale. The `--var` aliasing means every
 *   override cascades through the whole theme automatically — change the
 *   primary color and every `bg-primary` button re-paints without any
 *   component code changes.
 *
 * Skill 3 — Zod Schema Validation
 *   `OverrideMapSchema` validates the override map. `CssKeySchema`
 *   validates the resolved CSS variable name (catches typos).
 */

import * as Y from "yjs";
import { z } from "zod";

// ─── Schemas (Skill 3) ─────────────────────────────────────────────────────

/**
 * An override is a map of logical key → value. Values are either
 * `var(--...)` references (the common case) or concrete dimensions /
 * fonts / shadow values. Logical keys are translated to CSS variable
 * names by the customizer at apply time.
 */
export const OverrideMapSchema = z.record(z.string().min(1).max(64), z.string().min(1).max(2048));
export type OverrideMap = z.infer<typeof OverrideMapSchema>;

/** A single override entry as it might come from a form input. */
export const OverrideEntrySchema = z.object({
  key: z.string().min(1).max(64),
  value: z.string().min(1).max(2048),
});
export type OverrideEntry = z.infer<typeof OverrideEntrySchema>;

/**
 * A CSS variable name validator. Used at apply time to catch typos in
 * the override map (e.g. `--color-priamry-500`).
 */
export const CssKeySchema = z
  .string()
  .regex(/^--[a-z][a-z0-9-]*$/, "CSS variable keys must start with `--` and use kebab-case");

/** A single css-var declaration in the resolved map. */
export const CssValueSchema = z.object({
  $value: z.string().min(1),
  $type: z.string().min(1),
});
export type CssValue = z.infer<typeof CssValueSchema>;

// ─── Logical key → CSS variable translation ────────────────────────────────

/**
 * The set of logical names the Customizer UI exposes. Adding a new
 * customizer knob is a 1-line edit here plus a corresponding form field.
 *
 * Pattern-based keys (`space-N`, `radius-N`, `shadow-N`) are handled
 * dynamically by `resolveKeyToVar()`.
 */
const LOGICAL_KEY_MAP: Record<string, string> = {
  // Color
  colorPrimary: "--color-primary-500",
  colorOnPrimary: "--color-on-primary",
  colorAccent: "--color-accent-500",
  colorOnAccent: "--color-on-accent",
  colorSurface: "--color-surface",
  colorSurfaceAlt: "--color-surface-alt",
  colorSurfaceDark: "--color-surface-dark",
  colorSurfaceTranslucent: "--color-surface-translucent",
  colorText: "--color-text",
  colorTextMuted: "--color-text-muted",
  colorBorder: "--color-border",
  colorFocusRing: "--color-focus-ring",
  colorError: "--color-error",
  colorSuccess: "--color-success",
  // Typography
  fontDisplay: "--font-display",
  fontBody: "--font-body",
  fontMono: "--font-mono",
  // Animation
  durationFast: "--duration-fast",
  durationBase: "--duration-base",
  durationEnter: "--duration-enter",
  durationPage: "--duration-page",
  easingStandard: "--easing-standard",
  easingDecelerate: "--easing-decelerate",
  easingAccelerate: "--easing-accelerate",
};

/**
 * Translate a logical key to its CSS variable name. Recognises the
 * static `LOGICAL_KEY_MAP` entries, pattern-based `space-N` / `radius-N`
 * / `shadow-N` / `duration-N` / `easing-N` keys, and passthroughs for
 * keys that already start with `--`.
 */
function resolveKeyToVar(key: string): string {
  if (key.startsWith("--")) return key;
  const direct = LOGICAL_KEY_MAP[key];
  if (direct) return direct;
  // Pattern-based: `<category>-<step>` → `--<category>-<step>`
  const m = /^(space|radius|shadow|duration|easing)-(.+)$/.exec(key);
  if (m) return `--${m[1]}-${m[2]}`;
  // Last resort: kebab-case the camelCase key.
  return `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
}

// ─── Public types ──────────────────────────────────────────────────────────

/**
 * The Yjs substrate key where overrides are persisted. Distinct from
 * the theme map (key `"theme"`) so the runtime can compute the resolved
 * tokens by reading both and merging.
 */
export const CUSTOMIZER_OVERRIDES_KEY = "theme-customizer-overrides";

/**
 * The customizer's base — only the `css` block is required. Callers can
 * pass the css group of a generator-emitted TokensDoc, or an empty map
 * for a "blank canvas" customizer.
 */
export type CustomizerBase = Record<string, CssValue>;

export interface CustomizerListener {
  (event: { kind: "set" | "unset" | "clear"; key: string | null }): void;
}

// ─── The customizer class ──────────────────────────────────────────────────

export class ThemeCustomizer {
  private readonly doc: Y.Doc;
  private readonly base: CustomizerBase;
  private readonly overrides: Y.Map<unknown>;
  private readonly listeners = new Set<CustomizerListener>();

  constructor(doc: Y.Doc, base: CustomizerBase) {
    this.doc = doc;
    this.base = base;
    this.overrides = doc.getMap(CUSTOMIZER_OVERRIDES_KEY);
  }

  // ─── Read ─────────────────────────────────────────────────────────────

  /** Return the current override map as a plain object. */
  getAll(): OverrideMap {
    const raw = this.overrides.toJSON();
    return (raw && typeof raw === "object" ? (raw as OverrideMap) : {}) ?? {};
  }

  /** Return a single override value, or undefined if absent. */
  get(key: string): string | undefined {
    const cssKey = resolveKeyToVar(key);
    const v = this.overrides.get(cssKey);
    return typeof v === "string" ? v : undefined;
  }

  /** Total number of active overrides. */
  size(): number {
    return this.overrides.size;
  }

  // ─── Write ────────────────────────────────────────────────────────────

  /**
   * Set a single override. Translates logical keys to CSS variable names
   * and validates the value with `OverrideEntrySchema` (Skill 3).
   */
  set(key: string, value: string): void {
    OverrideEntrySchema.parse({ key, value });
    const cssKey = resolveKeyToVar(key);
    CssKeySchema.parse(cssKey);
    this.doc.transact(() => {
      this.overrides.set(cssKey, value);
    });
    this.emit({ kind: "set", key: cssKey });
  }

  /** Remove a single override. */
  unset(key: string): void {
    const cssKey = resolveKeyToVar(key);
    this.doc.transact(() => {
      this.overrides.delete(cssKey);
    });
    this.emit({ kind: "unset", key: cssKey });
  }

  /** Drop every override. The customizer reverts to the base. */
  clear(): void {
    this.doc.transact(() => {
      for (const key of Array.from(this.overrides.keys())) {
        this.overrides.delete(key);
      }
    });
    this.emit({ kind: "clear", key: null });
  }

  // ─── Resolution ───────────────────────────────────────────────────────

  /**
   * Deep-merge the overrides into the base `css` block and return the
   * resolved set. Pure function of the Y.Map state — no side effects,
   * no `Date` / `Math.random`. The runtime injects the resulting `css`
   * block as `:root { ... }` to take effect.
   *
   * For the common case (override = `var(--color-blue-500)`), the
   * resolved css map is `css["--color-primary-500"] = "var(--color-
   * blue-500)"`. Components that reference `var(--color-primary-500)`
   * transitively resolve to the user's new value.
   */
  resolved(): CustomizerBase {
    const css: CustomizerBase = {};
    // Start from the base.
    for (const [k, v] of Object.entries(this.base)) {
      css[k] = { $value: v.$value, $type: v.$type };
    }
    // Apply every override.
    for (const [cssKey, rawValue] of Object.entries(this.getAll())) {
      const parsedKey = CssKeySchema.safeParse(cssKey);
      if (!parsedKey.success) continue;
      const value = String(rawValue);
      // Preserve the existing $type if the key is in the base; otherwise
      // mark it `other` so downstream tooling knows it's a literal.
      const existing = css[cssKey];
      css[cssKey] = {
        $type: existing?.$type ?? "other",
        $value: value,
      };
    }
    return css;
  }

  // ─── Observability ────────────────────────────────────────────────────

  /**
   * Subscribe to override mutations. Fires synchronously after each
   * `set` / `unset` / `clear` from THIS instance (mutations from peers
   * land through Yjs's own observer channel — see `observeYjs`).
   */
  subscribe(listener: CustomizerListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Subscribe to the underlying Y.Map for multiplayer awareness. Returns
   * the unsubscribe function. The callback receives a list of Yjs events
   * — one per local or remote override change.
   */
  observeYjs(callback: (events: Y.YEvent<Y.AbstractType<unknown>>[]) => void): () => void {
    const handler = (events: Y.YEvent<Y.AbstractType<unknown>>[]) => callback(events);
    this.overrides.observeDeep(handler);
    return () => this.overrides.unobserveDeep(handler);
  }

  // ─── Internals ────────────────────────────────────────────────────────

  private emit(event: Parameters<CustomizerListener>[0]): void {
    this.listeners.forEach((l) => l(event));
  }
}

// Re-export z so consumers can validate inputs at their boundary.
export { z };
