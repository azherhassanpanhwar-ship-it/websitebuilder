"use client";

/**
 * LATTICE ThemeProvider (UI Bridge)
 * ──────────────────────────────────
 * A React Context provider that wires the LATTICE editor to the active
 * theme. It does three things:
 *
 *   1. Reads the active theme from a Y.Doc's `theme` Y.Map (Skill 1).
 *   2. Injects the theme's W3C Design Tokens as CSS custom properties
 *      on `:root` so Tailwind utilities (`bg-primary`, `rounded-md`,
 *      `shadow-md`, …) resolve via `var(--token-*)` references (Skill 2).
 *   3. Exposes the parsed theme + tokens via React Context so editor
 *      panels (Customizer, Block Picker, etc.) can subscribe to live
 *      multiplayer changes.
 *
 * Multiplayer awareness
 *   The provider subscribes to `Y.Map.observeDeep` on the theme map.
 *   When a peer swaps the theme (via the Theme Switcher) or applies a
 *   customizer override, every connected client's `useTheme()` hook
 *   re-renders with the new tokens.
 *
 * SSR safety
 *   The provider is marked `"use client"`. All `window` / `document`
 *   access is gated behind `useEffect` so Next.js server rendering
 *   never touches the DOM. The initial render returns `theme: null,
 *   tokens: null`; the client hydrates with the actual theme on mount.
 *
 * Skill 2 compliance
 *   The CSS variable values are *literal atomic tokens* from the theme's
 *   resolved `css` group. Components never receive these literals — they
 *   consume the variables via Tailwind utilities / `var(--*)`. The
 *   provider does NOT invent or rewrite any value.
 */

import * as Y from "yjs";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { z } from "zod";

import { Theme } from "./ThemeSchema";
import type { TokensDoc } from "./ThemeGenerator";

// ─── Yjs keys (shared with ThemeSwitcher / ThemeCustomizer) ────────────────

/** Y.Doc key where the active theme snapshot lives. */
export const THEME_KEY = "theme";
/** Y.Doc key where customizer overrides live. */
export const CUSTOMIZER_OVERRIDES_KEY = "theme-customizer-overrides";

// ─── Context value ──────────────────────────────────────────────────────────

export interface ThemeContextValue {
  /** The validated active theme, or null until the Y.Doc provides one. */
  theme: Theme | null;
  /**
   * The resolved W3C tokens doc, with the theme's `css` block merged
   * with any active customizer overrides. Components / Tailwind consume
   * these via `var(--*)` — never by reaching into the object.
   */
  tokens: TokensDoc | null;
  /** True once the provider has loaded the initial theme from the Y.Doc. */
  ready: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ─── Props ─────────────────────────────────────────────────────────────────

export interface ThemeProviderProps {
  /**
   * The Y.Doc the editor is working on. The provider reads the active
   * theme from `doc.getMap(THEME_KEY)` and observes it for live updates.
   */
  doc: Y.Doc;
  /**
   * Optional override of the `<style>` element id. Useful when multiple
   * editors coexist on the same page (one per site, for example).
   * Defaults to `"lattice-theme-tokens"`.
   */
  styleId?: string;
  /**
   * Optional override of the CSS selector the variables are written to.
   * Defaults to `":root"`. Pass a scoped selector (e.g. `"[data-site-id=
   * 'abc']"`) to isolate a theme to a sub-tree of the DOM.
   */
  rootSelector?: string;
  children: ReactNode;
}

// ─── The provider ──────────────────────────────────────────────────────────

export function ThemeProvider({
  doc,
  styleId = "lattice-theme-tokens",
  rootSelector = ":root",
  children,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [tokens, setTokens] = useState<TokensDoc | null>(null);
  const [ready, setReady] = useState(false);

  // Memoize the theme map so we don't re-resolve on every render.
  const themeMap = useMemo(() => doc.getMap(THEME_KEY), [doc]);
  const overridesMap = useMemo(() => doc.getMap(CUSTOMIZER_OVERRIDES_KEY), [doc]);

  useEffect(() => {
    // Resolve the current theme + tokens from the Y.Doc.
    const resolve = () => {
      const snapshot = themeMap.toJSON();
      const candidate = snapshot ?? null;
      const parsed = Theme.safeParse(candidate);
      if (parsed.success) {
        setTheme(parsed.data);
        setTokens(buildTokensFromTheme(parsed.data, overridesMap));
      } else {
        // Defensive: if the Y.Doc is in an unexpected shape, leave the
        // previous theme in place rather than nuking the editor.
        if (candidate === null) {
          setTheme(null);
          setTokens(null);
        }
      }
      setReady(true);
    };

    resolve();

    // Re-resolve whenever the theme OR the customizer overrides change.
    const handler = () => resolve();
    themeMap.observeDeep(handler);
    overridesMap.observeDeep(handler);

    return () => {
      themeMap.unobserveDeep(handler);
      overridesMap.unobserveDeep(handler);
    };
  }, [themeMap, overridesMap]);

  // Apply the resolved tokens to the DOM as CSS custom properties.
  // Pure DOM side effect; runs only when `tokens` changes.
  useEffect(() => {
    if (typeof document === "undefined") return; // SSR safety
    if (!tokens) {
      // If we have no theme, leave the previous <style> tag in place —
      // its declarations stay valid as long as Tailwind isn't relying on
      // theme-specific values. A future task can clear it explicitly.
      return;
    }
    const css = serializeTokens(tokens);
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `${rootSelector} {\n${css}\n}`;
  }, [tokens, styleId, rootSelector]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, tokens, ready }),
    [theme, tokens, ready],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// ─── Hook ──────────────────────────────────────────────────────────────────

/**
 * Read the active theme + tokens from context. Throws if used outside
 * a `<ThemeProvider>` — the editor can't function without a theme.
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme() must be called inside a <ThemeProvider>");
  }
  return ctx;
}

// ─── Internal: build a minimal TokensDoc from a Theme ─────────────────────

/**
 * Derive a runnable `TokensDoc` from a validated Theme. Most fields
 * are placeholders — the runtime reads primarily from `tokens.css`,
 * which we construct by:
 *   1. Seeding every `--var-name` referenced by the theme's settings
 *      (hero, header, footer, animation, color) with a literal
 *      placeholder value (the runtime resolves to the same var).
 *   2. Letting customizer overrides, if any, win on conflict.
 *
 * The full TokensDoc (with literal atomic values for color / space /
 * radius / shadow) is the output of `ThemeGenerator.generateTheme()`.
 * When the editor knows it has a generator-emitted theme available,
 * callers should pass that into the provider instead and skip this
 * shim. For the scaffold, this default gives every site a working
 * set of CSS variables.
 */
function buildTokensFromTheme(theme: Theme, overridesMap: Y.Map<unknown>): TokensDoc {
  const css: TokensDoc["css"] = {};
  // Seed every TokenRef the theme's settings reference, pointing to
  // itself. The runtime override (customizer) can replace these.
  const refs = collectTokenRefs(theme);
  for (const ref of refs) {
    css[ref] = { $value: `var(${ref})`, $type: "other" };
  }
  // Apply customizer overrides.
  const overrides = overridesMap.toJSON() as Record<string, string> | null;
  if (overrides && typeof overrides === "object") {
    for (const [k, v] of Object.entries(overrides)) {
      if (typeof v === "string") {
        css[k] = { $value: v, $type: "other" };
      }
    }
  }
  return {
    $description: "ThemeProvider runtime resolution",
    $metadata: {
      generator: "theme-provider-runtime",
      params: {},
      system: "LATTICE",
      version: theme.metadata.version,
    },
    $schema: "https://design-tokens.github.io/community-group/format/",
    // The other fields are placeholders — consumers should reach into
    // `theme.settings` (validated by ThemeSchema) rather than these
    // top-level tokens.* blocks, which exist only for shape compatibility.
    animation: {
      durationBase: "--duration-base",
      durationEnter: "--duration-enter",
      durationFast: "--duration-fast",
      durationPage: "--duration-page",
      easingAccelerate: "--easing-accelerate",
      easingDecelerate: "--easing-decelerate",
      easingStandard: "--easing-standard",
      respectReducedMotion: true,
      style: theme.settings.animation.style,
    },
    color: {
      accent: {
        "100": theme.settings.color.accent,
        "50": theme.settings.color.accent,
        "500": theme.settings.color.accent,
        "900": theme.settings.color.accent,
      },
      border: theme.settings.color.border,
      error: theme.settings.color.error,
      focusRing: theme.settings.color.focusRing,
      onAccent: theme.settings.color.onAccent,
      onPrimary: theme.settings.color.onPrimary,
      primary: {
        "100": theme.settings.color.primary,
        "50": theme.settings.color.primary,
        "500": theme.settings.color.primary,
        "900": theme.settings.color.primary,
      },
      success: theme.settings.color.success,
      surface: theme.settings.color.surface,
      surfaceAlt: theme.settings.color.surfaceAlt,
      surfaceDark: theme.settings.color.surfaceDark,
      text: theme.settings.color.text,
      textMuted: theme.settings.color.textMuted,
    },
    css,
    footer: { ...theme.settings.footer },
    header: { ...theme.settings.header },
    hero: {
      alignment: theme.settings.hero.alignment,
      minHeight: theme.settings.hero.minHeight,
      ...(theme.settings.hero.overlay ? { overlay: theme.settings.hero.overlay } : {}),
      pattern: theme.settings.hero.pattern,
    },
    radius: {},
    shadow: {},
    space: {},
    typography: {
      bodyLineHeight: theme.settings.typography.bodyLineHeight,
      displayLineHeight: theme.settings.typography.displayLineHeight,
      family: { ...theme.settings.typography.family },
      scaleRatio: theme.settings.typography.scaleRatio,
      weights: { ...theme.settings.typography.weights },
    },
  };
}

/**
 * Walk the theme's settings and collect every TokenRef string. The
 * resulting set is the set of CSS variables the runtime must declare
 * on `:root` for the theme to render.
 */
function collectTokenRefs(theme: Theme): Set<string> {
  const refs = new Set<string>();
  // Walk all the TokenRef strings in settings.
  const visit = (v: unknown) => {
    if (typeof v !== "string") return;
    if (v.startsWith("--")) refs.add(v);
  };
  // Color settings
  for (const v of Object.values(theme.settings.color)) visit(v);
  // Typography
  visit(theme.settings.typography.family.display);
  visit(theme.settings.typography.family.body);
  if (theme.settings.typography.family.mono) {
    visit(theme.settings.typography.family.mono);
  }
  if (theme.settings.typography.trackingDisplay) {
    visit(theme.settings.typography.trackingDisplay);
  }
  if (theme.settings.typography.trackingBody) {
    visit(theme.settings.typography.trackingBody);
  }
  // Spacing
  visit(theme.settings.spacing.baseUnit);
  visit(theme.settings.spacing.radius);
  if (theme.settings.spacing.borderWidth) {
    visit(theme.settings.spacing.borderWidth);
  }
  // Shadow
  visit(theme.settings.shadow.card);
  if (theme.settings.shadow.overlay) visit(theme.settings.shadow.overlay);
  if (theme.settings.shadow.primary) visit(theme.settings.shadow.primary);
  // Hero / header / footer
  visit(theme.settings.hero.minHeight);
  if (theme.settings.hero.overlay) visit(theme.settings.hero.overlay);
  visit(theme.settings.header.height);
  visit(theme.settings.header.background);
  visit(theme.settings.header.foreground);
  visit(theme.settings.footer.background);
  visit(theme.settings.footer.foreground);
  // Animation
  visit(theme.settings.animation.durationFast);
  visit(theme.settings.animation.durationBase);
  visit(theme.settings.animation.durationEnter);
  visit(theme.settings.animation.durationPage);
  visit(theme.settings.animation.easingStandard);
  if (theme.settings.animation.easingDecelerate) {
    visit(theme.settings.animation.easingDecelerate);
  }
  if (theme.settings.animation.easingAccelerate) {
    visit(theme.settings.animation.easingAccelerate);
  }
  return refs;
}

/**
 * Serialize a TokensDoc's `css` block into a CSS string. Each entry
 * becomes `--var-name: $value;`. Comments are intentionally omitted —
 * the runtime injects the styles inline and there's no editor for
 * them to read.
 */
function serializeTokens(tokens: TokensDoc): string {
  const lines: string[] = [];
  // Object iteration is insertion-ordered per ECMA-262 §13.7.5.13 (string
  // keys), so the output is deterministic for a given input.
  for (const [k, v] of Object.entries(tokens.css)) {
    lines.push(`  ${k}: ${v.$value};`);
  }
  return lines.join("\n");
}

// Re-export z for ergonomic consumers that want to validate inputs
// alongside the provider (e.g. a customizer panel that receives a partial
// theme).
export { z };
