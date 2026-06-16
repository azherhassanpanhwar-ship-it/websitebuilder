/**
 * ThemeSchema unit tests (Task 1.17)
 * ──────────────────────────────────
 * Verifies the Zod theme schema:
 *   1. Accepts a valid Theme (the exact shape the editor test page
 *      seeds — see apps/web/src/app/editor/page.tsx → `sampleTheme()`).
 *   2. Rejects hex literals (Skill 2: tokens only, never hex).
 *   3. Enforces the 3-preset rule (Section 6 quality bar).
 *   4. Enforces the kebab-case slug + semver version rules.
 *   5. Rejects unknown keys (`.strict()`).
 *
 * Note on preset overrides: the schema is *not* deeply partial — every
 * settings group inside `overrides` is either absent or a full
 * replacement. See the comment block in `ThemeSchema.ts` near the
 * `ThemePreset` declaration. This is intentional (Zod 4 dropped
 * `deepPartial`) and the tests reflect that contract.
 */
import { describe, it, expect } from "vitest";

import { Theme, TokenRef } from "@/engine/theme/ThemeSchema";

const SAMPLE_THEME = {
  metadata: {
    slug: "fine-dining",
    name: "Fine Dining",
    category: "restaurants",
    subcategory: "fine-dining",
    tags: ["luxury", "serif"],
    targetIndustry: "restaurants",
    designStyle: "luxury",
    colorMood: "warm",
    screenshot: "screenshot.png",
    version: "1.0.0",
    wcagLevel: "AA",
  },
  settings: {
    color: {
      primary: "--color-primary-500",
      onPrimary: "--color-on-primary",
      accent: "--color-accent-500",
      onAccent: "--color-on-accent",
      surface: "--color-surface",
      surfaceAlt: "--color-surface-alt",
      surfaceDark: "--color-surface-dark",
      text: "--color-text",
      textMuted: "--color-text-muted",
      border: "--color-border",
      focusRing: "--color-focus-ring",
      error: "--color-error",
      success: "--color-success",
    },
    typography: {
      family: { display: "--font-display", body: "--font-body" },
      weights: { regular: 400, medium: 500, bold: 700 },
      scaleRatio: 1.25,
      bodyLineHeight: 1.6,
      displayLineHeight: 1.15,
    },
    spacing: {
      baseUnit: "--space-2",
      density: "comfortable",
      radius: "--radius-md",
    },
    shadow: { style: "subtle", card: "--shadow-md" },
    hero: {
      pattern: "full-bleed-image",
      minHeight: "--space-10",
      alignment: "bottom",
    },
    header: {
      style: "solid-sticky",
      height: "--space-8",
      background: "--color-surface",
      foreground: "--color-text",
    },
    footer: {
      style: "expanded",
      background: "--color-surface-dark",
      foreground: "--color-text-muted",
      newsletter: false,
    },
    animation: {
      style: "subtle",
      durationFast: "--duration-fast",
      durationBase: "--duration-base",
      durationEnter: "--duration-enter",
      durationPage: "--duration-page",
      easingStandard: "--easing-standard",
      respectReducedMotion: true,
    },
  },
  // Each preset replaces one full settings group. Empty `overrides` is
  // also valid (the preset is then just a labelled label).
  presets: [
    {
      id: "bold",
      label: "Bold",
      overrides: {
        animation: {
          style: "bold",
          durationFast: "--duration-fast",
          durationBase: "--duration-base",
          durationEnter: "--duration-enter",
          durationPage: "--duration-page",
          easingStandard: "--easing-standard",
          respectReducedMotion: true,
        },
      },
    },
    {
      id: "minimal",
      label: "Minimal",
      overrides: {
        animation: {
          style: "none",
          durationFast: "--duration-fast",
          durationBase: "--duration-base",
          durationEnter: "--duration-enter",
          durationPage: "--duration-page",
          easingStandard: "--easing-standard",
          respectReducedMotion: true,
        },
      },
    },
    { id: "warm", label: "Warm", overrides: {} },
  ],
};

describe("ThemeSchema", () => {
  it("accepts a fully-populated theme", () => {
    const result = Theme.safeParse(SAMPLE_THEME);
    if (!result.success) {
      // Surface the Zod issues so a regression is debuggable from the test
      // output alone (no need to re-run with extra logging).
      console.error(JSON.stringify(result.error.issues, null, 2));
    }
    expect(result.success).toBe(true);
  });

  it("rejects a hex literal in TokenRef position (Skill 2)", () => {
    const result = TokenRef.safeParse("#FF0000");
    expect(result.success).toBe(false);
  });

  it("accepts a valid CSS custom property name", () => {
    const result = TokenRef.safeParse("--color-primary-500");
    expect(result.success).toBe(true);
  });

  it("enforces exactly 3 presets", () => {
    const two = { ...SAMPLE_THEME, presets: SAMPLE_THEME.presets.slice(0, 2) };
    const four = {
      ...SAMPLE_THEME,
      presets: [...SAMPLE_THEME.presets, SAMPLE_THEME.presets[0]],
    };
    expect(Theme.safeParse(two).success).toBe(false);
    expect(Theme.safeParse(four).success).toBe(false);
  });

  it("rejects non-kebab-case slugs", () => {
    const bad = {
      ...SAMPLE_THEME,
      metadata: { ...SAMPLE_THEME.metadata, slug: "Fine_Dining_2" },
    };
    const result = Theme.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("rejects non-semver versions", () => {
    const bad = {
      ...SAMPLE_THEME,
      metadata: { ...SAMPLE_THEME.metadata, version: "v1" },
    };
    expect(Theme.safeParse(bad).success).toBe(false);
  });

  it("rejects unknown top-level keys (.strict())", () => {
    const bad = { ...SAMPLE_THEME, surprise: "not allowed" };
    expect(Theme.safeParse(bad).success).toBe(false);
  });
});
