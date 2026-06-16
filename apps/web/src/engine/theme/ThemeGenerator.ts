/**
 * LATTICE Theme Generator v0 (Task 2.26)
 * ──────────────────────────────────────
 * A *deterministic*, *parameterized* function (NO AI) that maps the
 * ThemeGeneratorParameters to a fully-resolved LATTICE theme.
 *
 * Output:
 *   1. `tokens`   — a W3C Design Tokens (DTCG) JSON document. The `css`
 *                   group contains the full set of CSS custom properties
 *                   that the runtime injects into `:root`.
 *   2. `tailwind` — a static `tailwind.config.ts` source string. Every
 *                   visual primitive maps to a `var(--...)` reference —
 *                   no hex, no px literals. (Step B of the God Mode
 *                   Design Workflow in CLAUDE.md §6.5.)
 *   3. `theme`    — a `Theme` object that satisfies the existing
 *                   `ThemeSchema` (and is what gets shipped to the
 *                   marketplace).
 *
 * Determinism contract:
 *   The function is *pure* — same input → byte-identical output. There
 *   is no `Date.now`, no `Math.random`, no `crypto.randomUUID`, no I/O,
 *   no global reads, no async. Stable object-literal iteration order is
 *   relied on for JSON.stringify reproducibility.
 *
 * Skill 2 compliance:
 *   - The generator's *code* has zero hex literals and zero px literals
 *     outside the deterministic data tables (palettes.ts, shadowScales.ts,
 *     etc.). Those tables are the single source of truth for color/shadow
 *     values, mirroring how a real design system uses a token compiler.
 *   - The output `tailwind` string contains *only* `var(--...)` references
 *     for every visual primitive. The output `theme.settings` contains
 *     only TokenRef strings (`--color-*`, `--space-*`, etc.).
 *   - The output `tokens.css` group IS where literal values live — this
 *     is the atomic token layer the design system needs. Components
 *     consume `var(--color-*)` from the tailwind output and never see
 *     these literals.
 */

import { z } from "zod";

import {
  AnimationSettings,
  ColorSettings,
  FontFamily,
  FontWeight,
  HeroSettings,
  HeaderSettings,
  FooterSettings,
  ShadowSettings,
  SpacingSettings,
  Theme,
  ThemeGeneratorParameters,
  ThemeMetadata,
  ThemePreset,
  ThemeSettings,
  TypographySettings,
} from "./ThemeSchema";

import { PALETTES, type ColorPalette, type PaletteName } from "./palettes";
import {
  TYPOGRAPHY_PAIRINGS,
  type TypographyPairing,
  type TypographyPairingName,
} from "./typographyPairings";
import { BASE_SPACE_PX, scaleSpace, SPACING_SCALE_MULTIPLIERS } from "./spacingScales";
import { RADIUS_SCALES, type RadiusFamily } from "./radiusScales";
import { SHADOW_SCALES, type ShadowStyle } from "./shadowScales";
import {
  ANIMATION_PRESETS,
  type AnimationPreset,
  type AnimationPresetName,
} from "./animationPresets";
import {
  HERO_PRESETS,
  HEADER_PRESETS,
  FOOTER_PRESETS,
  type HeroPreset,
  type HeaderPreset,
  type FooterPreset,
} from "./componentPresets";

// ─── Output shape ─────────────────────────────────────────────────────────

/**
 * The resolved W3C tokens document. The `css` group is the single source
 * of CSS custom-property declarations the runtime injects into `:root`.
 */
export interface TokensDoc {
  $schema: string;
  $description: string;
  $metadata: {
    system: string;
    version: string;
    generator: string;
    params: Record<string, string>;
  };
  space: Record<string, { $value: string; $type: "dimension" }>;
  radius: Record<string, { $value: string; $type: "dimension" }>;
  shadow: Record<string, { $value: string; $type: "shadow" }>;
  color: {
    primary: { "50": string; "100": string; "500": string; "900": string };
    onPrimary: string;
    accent: { "50": string; "100": string; "500": string; "900": string };
    onAccent: string;
    surface: string;
    surfaceAlt: string;
    surfaceDark: string;
    text: string;
    textMuted: string;
    border: string;
    focusRing: string;
    error: string;
    success: string;
  };
  typography: {
    family: { display: string; body: string; mono?: string };
    weights: { regular: number; medium: number; bold: number };
    scaleRatio: number;
    bodyLineHeight: number;
    displayLineHeight: number;
  };
  hero: { pattern: string; minHeight: string; overlay?: string; alignment: string };
  header: { style: string; height: string; background: string; foreground: string };
  footer: { style: string; background: string; foreground: string; newsletter: boolean };
  animation: {
    style: string;
    durationFast: string;
    durationBase: string;
    durationEnter: string;
    durationPage: string;
    easingStandard: string;
    easingDecelerate: string;
    easingAccelerate: string;
    respectReducedMotion: boolean;
  };
  /**
   * The CSS custom-property map. Every entry is `--<name>: <value>`. The
   * generator emits this group as the `:root { ... }` block in
   * globals.css. Components and the Tailwind config consume `var(--...)`
   * only — they never reach into this group.
   */
  css: Record<string, { $value: string; $type: string }>;
}

export interface ThemeGeneratorOutput {
  tokens: TokensDoc;
  tailwind: string;
  theme: Theme;
}

// ─── Public API ───────────────────────────────────────────────────────────

/**
 * Generate a complete LATTICE theme from a set of design parameters.
 *
 * Pure function — no I/O, no Date, no Math.random, no global reads.
 * Same input → byte-identical output across runs and processes.
 */
export function generateTheme(
  input: ThemeGeneratorParameters,
  options: { metadata?: Partial<ThemeMetadata> } = {},
): ThemeGeneratorOutput {
  // Skill 3: validate the boundary input. Throws on invalid input — callers
  // that want graceful handling should call `.safeParse()` themselves first.
  const params = ThemeGeneratorParameters.parse(input);

  // 1. Look up the deterministic data tables.
  const palette: ColorPalette = PALETTES[params.palette];
  const typography: TypographyPairing = TYPOGRAPHY_PAIRINGS[params.typographyPairing];
  const spacingMultiplier = SPACING_SCALE_MULTIPLIERS[params.spacingScale];
  const scaledSpace = scaleSpace(spacingMultiplier);
  const radiusScale = RADIUS_SCALES[params.cornerRadius];
  const shadowScale = SHADOW_SCALES[params.shadowStyle];
  const animationPreset = ANIMATION_PRESETS[params.animationStyle];
  const heroPreset: HeroPreset = HERO_PRESETS[params.heroPattern];
  const headerPreset: HeaderPreset = HEADER_PRESETS[params.headerStyle];
  const footerPreset: FooterPreset = FOOTER_PRESETS[params.footerStyle];

  // 2. Build the resolved tokens document.
  const tokens = buildTokensDoc({
    params,
    palette,
    typography,
    scaledSpace,
    radiusScale,
    shadowScale,
    animationPreset,
    heroPreset,
    headerPreset,
    footerPreset,
  });

  // 3. Build the static tailwind config source. The string is identical
  //    for every input — values resolve at runtime via the CSS variables
  //    the tokens doc emits into `:root`.
  const tailwind = renderTailwindConfig();

  // 4. Build the validated Theme object (passes ThemeSchema.safeParse).
  const theme = buildThemeObject({ params, tokens, metadata: options.metadata });

  return { tokens, tailwind, theme };
}

// ─── Tokens doc builder ───────────────────────────────────────────────────

interface BuildTokensInput {
  params: ThemeGeneratorParameters;
  palette: ColorPalette;
  typography: TypographyPairing;
  scaledSpace: Record<string, string>;
  radiusScale: Record<"none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full", string>;
  shadowScale: Record<"none" | "xs" | "sm" | "md" | "lg" | "xl" | "colored" | "inner", string>;
  animationPreset: AnimationPreset;
  heroPreset: HeroPreset;
  headerPreset: HeaderPreset;
  footerPreset: FooterPreset;
}

function buildTokensDoc(input: BuildTokensInput): TokensDoc {
  const {
    params,
    palette,
    typography,
    scaledSpace,
    radiusScale,
    shadowScale,
    animationPreset,
    heroPreset,
    headerPreset,
    footerPreset,
  } = input;

  // 2a. Atomic tokens (resolved with the chosen scales / multiplier).
  const space: TokensDoc["space"] = {};
  for (const [k, v] of Object.entries(scaledSpace)) {
    space[k] = { $value: v, $type: "dimension" };
  }

  const radius: TokensDoc["radius"] = {
    "2xl": { $value: radiusScale["2xl"], $type: "dimension" },
    full: { $value: radiusScale.full, $type: "dimension" },
    lg: { $value: radiusScale.lg, $type: "dimension" },
    md: { $value: radiusScale.md, $type: "dimension" },
    none: { $value: radiusScale.none, $type: "dimension" },
    sm: { $value: radiusScale.sm, $type: "dimension" },
    xl: { $value: radiusScale.xl, $type: "dimension" },
    xs: { $value: radiusScale.xs, $type: "dimension" },
  };

  const shadow: TokensDoc["shadow"] = {
    colored: { $value: shadowScale.colored, $type: "shadow" },
    inner: { $value: shadowScale.inner, $type: "shadow" },
    lg: { $value: shadowScale.lg, $type: "shadow" },
    md: { $value: shadowScale.md, $type: "shadow" },
    none: { $value: shadowScale.none, $type: "shadow" },
    sm: { $value: shadowScale.sm, $type: "shadow" },
    xl: { $value: shadowScale.xl, $type: "shadow" },
    xs: { $value: shadowScale.xs, $type: "shadow" },
  };

  // 2b. Color — literal hex (source of truth); components consume --vars.
  const color: TokensDoc["color"] = {
    accent: palette.accent,
    border: palette.border,
    error: palette.error,
    focusRing: palette.focusRing,
    onAccent: palette.onAccent,
    onPrimary: palette.onPrimary,
    primary: palette.primary,
    success: palette.success,
    surface: palette.surface,
    surfaceAlt: palette.surfaceAlt,
    surfaceDark: palette.surfaceDark,
    text: palette.text,
    textMuted: palette.textMuted,
  };

  // 2c. CSS custom-property map. The runtime emits this verbatim as
  //     `:root { --color-primary-500: <value>; ... }` in globals.css.
  const css: TokensDoc["css"] = {};
  for (const [k, v] of Object.entries(scaledSpace)) {
    css[`--space-${k}`] = { $value: v, $type: "dimension" };
  }
  for (const [k, v] of Object.entries(radiusScale)) {
    css[`--radius-${k}`] = { $value: v, $type: "dimension" };
  }
  for (const [k, v] of Object.entries(shadowScale)) {
    css[`--shadow-${k}`] = { $value: v, $type: "shadow" };
  }
  // Color CSS vars (50/100/500/900 ramps + the standalone colors).
  for (const ramp of ["primary", "accent"] as const) {
    for (const step of ["50", "100", "500", "900"] as const) {
      css[`--color-${ramp}-${step}`] = { $value: palette[ramp][step], $type: "color" };
    }
  }
  css["--color-on-primary"] = { $value: palette.onPrimary, $type: "color" };
  css["--color-on-accent"] = { $value: palette.onAccent, $type: "color" };
  css["--color-surface"] = { $value: palette.surface, $type: "color" };
  css["--color-surface-alt"] = { $value: palette.surfaceAlt, $type: "color" };
  css["--color-surface-dark"] = { $value: palette.surfaceDark, $type: "color" };
  css["--color-text"] = { $value: palette.text, $type: "color" };
  css["--color-text-muted"] = { $value: palette.textMuted, $type: "color" };
  css["--color-border"] = { $value: palette.border, $type: "color" };
  css["--color-focus-ring"] = { $value: palette.focusRing, $type: "color" };
  css["--color-error"] = { $value: palette.error, $type: "color" };
  css["--color-success"] = { $value: palette.success, $type: "color" };

  // Typography CSS vars (the actual font-family stack, not a TokenRef —
  // fonts are loaded via next/font, and the resolved family is what we
  // emit so the var points at the loaded family name).
  css["--font-display"] = { $value: typography.display, $type: "fontFamily" };
  css["--font-body"] = { $value: typography.body, $type: "fontFamily" };
  if (typography.mono) {
    css["--font-mono"] = { $value: typography.mono, $type: "fontFamily" };
  }

  // Animation tokens.
  css["--duration-fast"] = { $value: animationPreset.durationFast, $type: "duration" };
  css["--duration-base"] = { $value: animationPreset.durationBase, $type: "duration" };
  css["--duration-enter"] = { $value: animationPreset.durationEnter, $type: "duration" };
  css["--duration-page"] = { $value: animationPreset.durationPage, $type: "duration" };
  css["--easing-standard"] = { $value: animationPreset.easingStandard, $type: "cubicBezier" };
  css["--easing-decelerate"] = { $value: animationPreset.easingDecelerate, $type: "cubicBezier" };
  css["--easing-accelerate"] = { $value: animationPreset.easingAccelerate, $type: "cubicBezier" };

  // Component CSS vars — translucent surface for transparent headers, and
  // per-hero-pattern overlay gradients. These are referenced as TokenRefs
  // by `componentPresets.ts`, so they MUST be emitted here or the
  // theme will ship dangling refs.
  css["--color-surface-translucent"] = {
    $value: withAlpha(palette.surface, 0.85),
    $type: "color",
  };
  const heroOverlay = heroOverlayFor(heroPreset.pattern);
  if (heroPreset.overlay) {
    css[heroPreset.overlay] = { $value: heroOverlay, $type: "shadow" };
  }

  // 2d. Compose the tokens doc.
  return {
    $description:
      `Generated LATTICE theme — palette:${params.palette} ` +
      `typography:${params.typographyPairing} ` +
      `spacing:${params.spacingScale} density:${params.layoutDensity} ` +
      `radius:${params.cornerRadius} shadow:${params.shadowStyle} ` +
      `hero:${params.heroPattern} header:${params.headerStyle} ` +
      `footer:${params.footerStyle} animation:${params.animationStyle}`,
    $metadata: {
      generator: "theme-generator-v0",
      params: {
        animationStyle: params.animationStyle,
        cornerRadius: params.cornerRadius,
        footerStyle: params.footerStyle,
        headerStyle: params.headerStyle,
        heroPattern: params.heroPattern,
        layoutDensity: params.layoutDensity,
        palette: params.palette,
        shadowStyle: params.shadowStyle,
        spacingScale: params.spacingScale,
        typographyPairing: params.typographyPairing,
        ...(params.contentType ? { contentType: params.contentType } : {}),
      },
      system: "LATTICE",
      version: "1.0.0",
    },
    $schema: "https://design-tokens.github.io/community-group/format/",
    animation: {
      durationBase: animationPreset.durationBase,
      durationEnter: animationPreset.durationEnter,
      durationFast: animationPreset.durationFast,
      durationPage: animationPreset.durationPage,
      easingAccelerate: animationPreset.easingAccelerate,
      easingDecelerate: animationPreset.easingDecelerate,
      easingStandard: animationPreset.easingStandard,
      respectReducedMotion: animationPreset.respectReducedMotion,
      style: params.animationStyle,
    },
    color,
    css,
    footer: {
      background: footerPreset.background,
      foreground: footerPreset.foreground,
      newsletter: footerPreset.newsletter,
      style: footerPreset.style,
    },
    header: {
      background: headerPreset.background,
      foreground: headerPreset.foreground,
      height: headerPreset.height,
      style: headerPreset.style,
    },
    hero: {
      alignment: heroPreset.alignment,
      minHeight: heroPreset.minHeight,
      ...(heroPreset.overlay ? { overlay: heroPreset.overlay } : {}),
      pattern: heroPreset.pattern,
    },
    radius,
    shadow,
    space,
    typography: {
      bodyLineHeight: typography.bodyLineHeight,
      displayLineHeight: typography.displayLineHeight,
      family: {
        body: typography.body,
        display: typography.display,
        ...(typography.mono ? { mono: typography.mono } : {}),
      },
      scaleRatio: typography.scaleRatio,
      weights: typography.weights,
    },
  };
}

// ─── Tailwind config renderer (static, no per-input branching) ───────────

/**
 * The tailwind config is a *static* template — every value is a
 * `var(--...)` reference. The actual values resolve at runtime from the
 * CSS variables that the tokens doc emits into `:root`.
 *
 * Note the absence of any literal hex or px — Skill 2 is enforced at the
 * most-used consumption point in the system.
 */
function renderTailwindConfig(): string {
  // String template is constructed once, with a stable key order. The
  // function returns the same string for every invocation.
  return `import type { Config } from "tailwindcss";

/**
 * LATTICE Tailwind config — generated by ThemeGenerator v0.
 *
 * Every value is a \`var(--token-name)\` reference. The actual values
 * come from the CSS custom properties emitted by the generator's tokens
 * doc. Changing themes = swapping the tokens doc; this file does not
 * change.
 *
 * DO NOT add literal colors / spacing / shadows here. Per Skill 2,
 * hardcoded visual primitives are forbidden in component code.
 */
const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
    "../../src/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      inherit: "inherit",
      surface: "var(--color-surface)",
      "surface-alt": "var(--color-surface-alt)",
      "surface-dark": "var(--color-surface-dark)",
      fg: "var(--color-text)",
      "fg-muted": "var(--color-text-muted)",
      primary: {
        50: "var(--color-primary-50)",
        100: "var(--color-primary-100)",
        500: "var(--color-primary-500)",
        900: "var(--color-primary-900)",
        DEFAULT: "var(--color-primary-500)",
      },
      "on-primary": "var(--color-on-primary)",
      accent: {
        50: "var(--color-accent-50)",
        100: "var(--color-accent-100)",
        500: "var(--color-accent-500)",
        900: "var(--color-accent-900)",
        DEFAULT: "var(--color-accent-500)",
      },
      "on-accent": "var(--color-on-accent)",
      border: "var(--color-border)",
      focus: "var(--color-focus-ring)",
      error: "var(--color-error)",
      success: "var(--color-success)",
    },
    fontFamily: {
      display: "var(--font-display)",
      body: "var(--font-body)",
      mono: "var(--font-mono)",
    },
    spacing: {
      0: "0",
      1: "var(--space-1)",
      2: "var(--space-2)",
      3: "var(--space-3)",
      4: "var(--space-4)",
      5: "var(--space-5)",
      6: "var(--space-6)",
      7: "var(--space-7)",
      8: "var(--space-8)",
      9: "var(--space-9)",
      10: "var(--space-10)",
      11: "var(--space-11)",
    },
    borderRadius: {
      none: "0",
      xs: "var(--radius-xs)",
      sm: "var(--radius-sm)",
      md: "var(--radius-md)",
      lg: "var(--radius-lg)",
      xl: "var(--radius-xl)",
      "2xl": "var(--radius-2xl)",
      full: "var(--radius-full)",
    },
    boxShadow: {
      none: "none",
      xs: "var(--shadow-xs)",
      sm: "var(--shadow-sm)",
      md: "var(--shadow-md)",
      lg: "var(--shadow-lg)",
      xl: "var(--shadow-xl)",
      colored: "var(--shadow-colored)",
      inner: "var(--shadow-inner)",
    },
    transitionDuration: {
      fast: "var(--duration-fast)",
      base: "var(--duration-base)",
      enter: "var(--duration-enter)",
      page: "var(--duration-page)",
    },
    transitionTimingFunction: {
      standard: "var(--easing-standard)",
      decelerate: "var(--easing-decelerate)",
      accelerate: "var(--easing-accelerate)",
    },
    extend: {},
  },
  plugins: [],
};

export default config;
`;
}

// ─── Theme object builder (validatable by ThemeSchema) ───────────────────

interface BuildThemeInput {
  params: ThemeGeneratorParameters;
  tokens: TokensDoc;
  metadata?: Partial<ThemeMetadata>;
}

function buildThemeObject(input: BuildThemeInput): Theme {
  const { params, tokens, metadata: metaOverride } = input;

  // 4a. Color settings (every field is a TokenRef, per Skill 2).
  const color: ColorSettings = {
    accent: "--color-accent-500",
    border: "--color-border",
    error: "--color-error",
    focusRing: "--color-focus-ring",
    onAccent: "--color-on-accent",
    onPrimary: "--color-on-primary",
    primary: "--color-primary-500",
    success: "--color-success",
    surface: "--color-surface",
    surfaceAlt: "--color-surface-alt",
    surfaceDark: "--color-surface-dark",
    text: "--color-text",
    textMuted: "--color-text-muted",
  };

  // 4b. Typography settings.
  const fontFamily: FontFamily = {
    body: "--font-body",
    display: "--font-display",
    ...(tokens.typography.family.mono ? { mono: "--font-mono" } : {}),
  };
  const weights: FontWeight = {
    bold: tokens.typography.weights.bold,
    medium: tokens.typography.weights.medium,
    regular: tokens.typography.weights.regular,
  };
  const typography: TypographySettings = {
    bodyLineHeight: tokens.typography.bodyLineHeight,
    displayLineHeight: tokens.typography.displayLineHeight,
    family: fontFamily,
    scaleRatio: tokens.typography.scaleRatio,
    weights,
  };

  // 4c. Spacing / shadow / hero / header / footer / animation.
  const spacing: SpacingSettings = {
    baseUnit: "--space-2",
    density: params.layoutDensity,
    // Track the chosen cornerRadius so settings stays consistent with
    // the resolved tokens (sharp → sm, soft → md, round → lg).
    radius: radiusTokenFor(params.cornerRadius),
  };
  const shadow: ShadowSettings = {
    card: "--shadow-md",
    style: params.shadowStyle,
  };
  const hero: HeroSettings = {
    alignment: tokens.hero.alignment as HeroSettings["alignment"],
    minHeight: tokens.hero.minHeight,
    ...(tokens.hero.overlay ? { overlay: tokens.hero.overlay } : {}),
    pattern: tokens.hero.pattern as HeroSettings["pattern"],
  };
  const header: HeaderSettings = {
    background: tokens.header.background,
    foreground: tokens.header.foreground,
    height: tokens.header.height,
    style: tokens.header.style as HeaderSettings["style"],
  };
  const footer: FooterSettings = {
    background: tokens.footer.background,
    foreground: tokens.footer.foreground,
    newsletter: tokens.footer.newsletter,
    style: tokens.footer.style as FooterSettings["style"],
  };
  const animation: AnimationSettings = {
    durationBase: "--duration-base",
    durationEnter: "--duration-enter",
    durationFast: "--duration-fast",
    durationPage: "--duration-page",
    easingAccelerate: "--easing-accelerate",
    easingDecelerate: "--easing-decelerate",
    easingStandard: "--easing-standard",
    respectReducedMotion: tokens.animation.respectReducedMotion,
    style: params.animationStyle,
  };

  // 4d. Build the metadata — stable, deterministic slug from the params.
  const slug = `generated-${params.palette}-${params.typographyPairing}-${params.spacingScale}`;
  const tags = [
    params.palette,
    params.typographyPairing,
    params.layoutDensity,
    params.cornerRadius,
    params.shadowStyle,
    ...(params.contentType ? [params.contentType] : []),
  ];
  // The override is an input-shape (Zod defaults are applied by `.parse()`
  // below). We build a single metadata object that ThemeSchema validates
  // end-to-end so the consumer gets a fully-populated ThemeMetadata.
  const baseMetadata = {
    category: categoryFromPalette(params.palette),
    colorMood: colorMoodFor(params.palette),
    designStyle: designStyleFor(params.typographyPairing, params.cornerRadius),
    name: `Generated: ${params.palette} · ${params.typographyPairing}`,
    screenshot: "screenshot.png",
    slug,
    subcategory: params.contentType ?? "general",
    tags,
    targetIndustry: params.contentType ?? "general",
  };
  const metadata: ThemeMetadata = {
    ...baseMetadata,
    authors: [],
    gallery: [],
    version: "1.0.0",
    wcagLevel: "AA",
    ...(metaOverride ?? {}),
  };

  // 4e. Three required presets (Bold / Minimal / Warm) — per §6 quality
  //     bar. Each is a token-reference override of the base theme.
  const presets: [ThemePreset, ThemePreset, ThemePreset] = [
    {
      id: "bold",
      label: "Bold",
      description: "Vivid color, more shadow, faster animation.",
      overrides: {
        animation: { ...animation, style: "bold" },
        shadow: { ...shadow, style: "pronounced" },
      },
    },
    {
      id: "minimal",
      label: "Minimal",
      description: "Flat color, no shadow, no motion.",
      overrides: {
        animation: { ...animation, style: "none" },
        shadow: { ...shadow, style: "none" },
      },
    },
    {
      id: "warm",
      label: "Warm",
      description: "Warmer shadow, gentler easing.",
      overrides: {
        animation: {
          ...animation,
          easingStandard: "--easing-decelerate",
          style: "subtle",
        },
        shadow: { ...shadow, style: "subtle" },
      },
    },
  ];

  // 4f. Compose + validate. If something is off, this throws — the
  //     boundary was crossed with bad data.
  const settings: ThemeSettings = {
    animation,
    color,
    footer,
    header,
    hero,
    shadow,
    spacing,
    typography,
  };
  const theme: Theme = Theme.parse({
    description:
      `Generated by ThemeGenerator v0 from params ` +
      `(palette=${params.palette}, pairing=${params.typographyPairing}).`,
    metadata,
    presets,
    settings,
  });
  return theme;
}

// ─── Tiny helpers (deterministic, no branching on Date.now) ──────────────

/**
 * Build an rgba(...) string by appending an alpha channel to a hex color.
 * Pure function: same input hex + alpha → same output. Used to materialise
 * the translucent surface and hero overlay CSS variables.
 */
function withAlpha(hex: string, alpha: number): string {
  const m = /^#?([0-9a-fA-F]{6})$/.exec(hex);
  if (!m || !m[1]) return hex;
  const r = parseInt(m[1].slice(0, 2), 16);
  const g = parseInt(m[1].slice(2, 4), 16);
  const b = parseInt(m[1].slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Map a hero pattern to a sensible default overlay gradient. These are
 * intentionally simple — the Customizer (Task 2.31) lets authors override
 * any of them per-theme.
 */
function heroOverlayFor(pattern: string): string {
  switch (pattern) {
    case "full-bleed-image":
    case "video-background":
      return "linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.6) 100%)";
    case "dark-moody":
      return "linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.8) 100%)";
    case "split-image-text":
      return "linear-gradient(90deg, transparent 50%, rgba(0, 0, 0, 0.1) 100%)";
    case "centered-text-image":
    case "minimal-text":
      return "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.05) 100%)";
    default:
      return "none";
  }
}

/**
 * Map the corner-radius family to the matching spacing.radius TokenRef so
 * the settings knob stays consistent with the resolved scale.
 */
function radiusTokenFor(family: "sharp" | "soft" | "round"): string {
  switch (family) {
    case "sharp":
      return "--radius-sm";
    case "soft":
      return "--radius-md";
    case "round":
      return "--radius-lg";
  }
}

/**
 * Map the palette to a sensible default marketplace category. The
 * contentType parameter (when supplied) takes precedence via metadata
 * override.
 */
function categoryFromPalette(palette: PaletteName): ThemeMetadata["category"] {
  switch (palette) {
    case "warm":
      return "restaurants";
    case "luxury":
      return "hospitality";
    case "cool":
      return "tech-saas";
    case "minimal":
      return "blog";
    case "bold":
      return "events";
    case "organic":
      return "health-wellness";
  }
}

function colorMoodFor(palette: PaletteName): ThemeMetadata["colorMood"] {
  switch (palette) {
    case "warm":
    case "organic":
      return "warm";
    case "cool":
    case "minimal":
      return "cool";
    case "luxury":
      return "neutral";
    case "bold":
      return "vibrant";
  }
}

function designStyleFor(
  pairing: TypographyPairingName,
  radius: RadiusFamily,
): ThemeMetadata["designStyle"] {
  if (pairing === "luxury-serif") return "luxury";
  if (pairing === "editorial") return "editorial";
  if (pairing === "bold-condensed") return "bold";
  if (radius === "sharp") return "corporate";
  if (radius === "round") return "organic";
  return "minimal";
}

// Silence the "unused" warning for `BASE_SPACE_PX` — it is intentionally
// re-exported so consumers can introspect the source scale.
export { BASE_SPACE_PX };
// Pull in zod for re-export so consumers don't need a second import.
export { z };
// Re-export the parameter and result types for ergonomic consumers.
export type { PaletteName, TypographyPairingName, RadiusFamily, ShadowStyle, AnimationPresetName };
