/**
 * LATTICE Theme Schema (Task 1.17 / Task 2.26)
 * ──────────────────────────────────────────────
 * The single source of truth for the shape of a LATTICE theme. Every theme
 * shipped in src/themes/** must validate against this schema before merge.
 *
 * Skill 2 — W3C Design Tokens
 *   - NO hex colors, no px font sizes, no px spacing values anywhere in this
 *     schema. Every visual primitive is a *reference* to a CSS custom property
 *     declared in src/tokens/base.tokens.json. The schema enforces the
 *     `--token-category-variant` naming contract via `TokenRef`.
 *
 * Skill 3 — Zod Schema Validation
 *   - This is the only valid way to define a Theme type. TypeScript types are
 *     inferred from these schemas (z.infer) and re-exported from
 *     src/types/LatticeTypes.ts. Do NOT hand-write a parallel interface.
 *   - Use `.safeParse()` at every API boundary that consumes theme data.
 */

import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// 1. Token references
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A reference to a CSS custom property. Must follow the
 * `--token-category-variant` convention from Skill 2.
 *
 *   ✅  '--color-primary-500'  '--font-size-body-md'  '--radius-md'
 *   ❌  '#FF0000'              '16px'                 'red'
 */
export const TokenRef = z
  .string()
  .regex(
    /^--[a-z][a-z0-9-]*$/,
    "TokenRef must be a CSS custom property name (e.g. \"--color-primary-500\")",
  );
export type TokenRef = z.infer<typeof TokenRef>;

/**
 * A typed wrapper so theme authors can either pass a bare TokenRef string OR
 * a `{ ref }` object — useful when the same field can also be overridden with
 * a literal value in a preset.
 */
export const TokenRefOrLiteral = z.union([TokenRef, z.string()]);
export type TokenRefOrLiteral = z.infer<typeof TokenRefOrLiteral>;

// ─────────────────────────────────────────────────────────────────────────────
// 2. Color settings — all tokens, never hex
// ─────────────────────────────────────────────────────────────────────────────

export const ColorSettings = z
  .object({
    /** Primary brand color token (e.g. `--color-primary-500`). */
    primary: TokenRef,
    /** Foreground color for content rendered on `primary` surfaces. */
    onPrimary: TokenRef,
    /** Secondary brand / accent token. */
    accent: TokenRef,
    /** Foreground color for content rendered on `accent` surfaces. */
    onAccent: TokenRef,
    /** Default page / card surface. */
    surface: TokenRef,
    /** Alternate surface (e.g. sidebar, panel). */
    surfaceAlt: TokenRef,
    /** Dark surface used for footers, inverse blocks. */
    surfaceDark: TokenRef,
    /** Default body text. */
    text: TokenRef,
    /** Muted / helper text. */
    textMuted: TokenRef,
    /** Hairline / divider / border color. */
    border: TokenRef,
    /** Focus-ring outline color (must meet WCAG 3:1 against any surface). */
    focusRing: TokenRef,
    /** Error state — required for forms / commerce. */
    error: TokenRef,
    /** Success state — required for forms / commerce. */
    success: TokenRef,
  })
  .strict();
export type ColorSettings = z.infer<typeof ColorSettings>;

// ─────────────────────────────────────────────────────────────────────────────
// 3. Typography settings — font family is a token, sizes are tokens
// ─────────────────────────────────────────────────────────────────────────────

export const FontFamily = z
  .object({
    /** Display / heading family token (e.g. `--font-display`). */
    display: TokenRef,
    /** Body text family token. */
    body: TokenRef,
    /** Optional monospace family token (code blocks, tabular data). */
    mono: TokenRef.optional(),
  })
  .strict();
export type FontFamily = z.infer<typeof FontFamily>;

export const FontWeight = z
  .object({
    regular: z.number().int().min(100).max(900).default(400),
    medium: z.number().int().min(100).max(900).default(500),
    bold: z.number().int().min(100).max(900).default(700),
  })
  .strict();
export type FontWeight = z.infer<typeof FontWeight>;

export const TypographySettings = z
  .object({
    family: FontFamily,
    weights: FontWeight,
    /**
     * Modular scale ratio applied to a base size. See Design Law 2.
     * 1.25 — small editorial   · 1.333 — standard   · 1.5 — dramatic
     */
    scaleRatio: z.number().min(1.05).max(2).default(1.25),
    /** Base body line-height (must be ≥ 1.5 per Design Law 2). */
    bodyLineHeight: z.number().min(1.5).max(1.85).default(1.6),
    /** Display line-height (typically 1.0–1.2). */
    displayLineHeight: z.number().min(1).max(1.4).default(1.15),
    /** Letter-spacing token for display headings (e.g. `--tracking-display`). */
    trackingDisplay: TokenRef.optional(),
    /** Letter-spacing token for body text. */
    trackingBody: TokenRef.optional(),
  })
  .strict();
export type TypographySettings = z.infer<typeof TypographySettings>;

// ─────────────────────────────────────────────────────────────────────────────
// 4. Spacing & density
// ─────────────────────────────────────────────────────────────────────────────

export const LayoutDensity = z.enum(["compact", "comfortable", "spacious"]);
export type LayoutDensity = z.infer<typeof LayoutDensity>;

export const SpacingSettings = z
  .object({
    /** 8px base unit — used as the reference for --space-1 … --space-11. */
    baseUnit: TokenRef,
    density: LayoutDensity.default("comfortable"),
    /** Corner-radius scale token (e.g. `--radius-md`). */
    radius: TokenRef,
    /** Border / hairline width token (e.g. `--border-hairline`). */
    borderWidth: TokenRef.optional(),
  })
  .strict();
export type SpacingSettings = z.infer<typeof SpacingSettings>;

// ─────────────────────────────────────────────────────────────────────────────
// 5. Shadow scale — token references, never raw rgba
// ─────────────────────────────────────────────────────────────────────────────

export const ShadowStyle = z.enum(["none", "subtle", "pronounced"]);
export type ShadowStyle = z.infer<typeof ShadowStyle>;

export const ShadowSettings = z
  .object({
    style: ShadowStyle.default("subtle"),
    /** Token for card shadow (e.g. `--shadow-md`). */
    card: TokenRef,
    /** Token for modal / overlay shadow. */
    overlay: TokenRef.optional(),
    /** Token for the colored "halo" used on primary CTAs. */
    primary: TokenRef.optional(),
  })
  .strict();
export type ShadowSettings = z.infer<typeof ShadowSettings>;

// ─────────────────────────────────────────────────────────────────────────────
// 6. Hero, header, footer — pattern + style enums
// ─────────────────────────────────────────────────────────────────────────────

export const HeroPattern = z.enum([
  "full-bleed-image",
  "split-image-text",
  "centered-text-image",
  "gallery-grid",
  "animated-interactive",
  "video-background",
  "device-mockup",
  "dark-moody",
  "minimal-text",
  "illustrated",
]);
export type HeroPattern = z.infer<typeof HeroPattern>;

export const HeaderStyle = z.enum([
  "transparent-over-hero",
  "solid-sticky",
  "centered-logo",
  "split-nav",
  "minimal-bar",
]);
export type HeaderStyle = z.infer<typeof HeaderStyle>;

export const FooterStyle = z.enum([
  "compact",
  "expanded",
  "multi-column",
  "centered-minimal",
]);
export type FooterStyle = z.infer<typeof FooterStyle>;

export const HeroSettings = z
  .object({
    pattern: HeroPattern,
    /** Recommended min-height token (e.g. `--hero-height-md`). */
    minHeight: TokenRef,
    /** Optional gradient overlay token (used by full-bleed / dark-moody). */
    overlay: TokenRef.optional(),
    /** Vertical alignment of hero content. */
    alignment: z.enum(["top", "center", "bottom"]).default("bottom"),
  })
  .strict();
export type HeroSettings = z.infer<typeof HeroSettings>;

export const HeaderSettings = z
  .object({
    style: HeaderStyle,
    height: TokenRef,
    /** Background token (may be a translucent ref like `--surface-translucent`). */
    background: TokenRef,
    foreground: TokenRef,
  })
  .strict();
export type HeaderSettings = z.infer<typeof HeaderSettings>;

export const FooterSettings = z
  .object({
    style: FooterStyle,
    background: TokenRef,
    foreground: TokenRef,
    /** Show newsletter capture (typical for multi-column / SaaS themes). */
    newsletter: z.boolean().default(false),
  })
  .strict();
export type FooterSettings = z.infer<typeof FooterSettings>;

// ─────────────────────────────────────────────────────────────────────────────
// 7. Animation settings — respects prefers-reduced-motion (Design Law 6)
// ─────────────────────────────────────────────────────────────────────────────

export const AnimationStyle = z.enum(["none", "subtle", "bold"]);
export type AnimationStyle = z.infer<typeof AnimationStyle>;

export const AnimationSettings = z
  .object({
    style: AnimationStyle.default("subtle"),
    /** Token for the standard fast duration (e.g. `--duration-fast`). */
    durationFast: TokenRef,
    durationBase: TokenRef,
    durationEnter: TokenRef,
    durationPage: TokenRef,
    /** Token for the standard easing curve. */
    easingStandard: TokenRef,
    easingDecelerate: TokenRef.optional(),
    easingAccelerate: TokenRef.optional(),
    /** Must always honor prefers-reduced-motion. */
    respectReducedMotion: z.boolean().default(true),
  })
  .strict();
export type AnimationSettings = z.infer<typeof AnimationSettings>;

// ─────────────────────────────────────────────────────────────────────────────
// 8. ThemeSettings — composite of all of the above
// ─────────────────────────────────────────────────────────────────────────────

export const ThemeSettings = z
  .object({
    color: ColorSettings,
    typography: TypographySettings,
    spacing: SpacingSettings,
    shadow: ShadowSettings,
    hero: HeroSettings,
    header: HeaderSettings,
    footer: FooterSettings,
    animation: AnimationSettings,
  })
  .strict();
export type ThemeSettings = z.infer<typeof ThemeSettings>;

// ─────────────────────────────────────────────────────────────────────────────
// 9. Presets — Bold / Minimal / Warm
// ─────────────────────────────────────────────────────────────────────────────

/** A preset is a partial override of the base ThemeSettings. */
export const ThemePreset = z
  .object({
    /** Preset slug, e.g. 'bold', 'minimal', 'warm'. */
    id: z
      .string()
      .regex(/^[a-z][a-z0-9-]*$/, "Preset id must be kebab-case")
      .min(2)
      .max(32),
    /** Human-readable label for the marketplace UI. */
    label: z.string().min(2).max(64),
    /** Optional one-line description shown in the Customizer. */
    description: z.string().max(160).optional(),
    /**
     * Partial theme overrides. Each top-level settings group (color,
     * typography, etc.) can be overridden as a unit. Authors can still pass
     * a field-level override by replacing the whole group with a tweaked
     * copy — this keeps the schema flat and avoids the `deepPartial`
     * ergonomics that Zod 4 deliberately dropped.
     */
    overrides: z
      .object({
        color: ColorSettings.optional(),
        typography: TypographySettings.optional(),
        spacing: SpacingSettings.optional(),
        shadow: ShadowSettings.optional(),
        hero: HeroSettings.optional(),
        header: HeaderSettings.optional(),
        footer: FooterSettings.optional(),
        animation: AnimationSettings.optional(),
      })
      .strict(),
  })
  .strict();
export type ThemePreset = z.infer<typeof ThemePreset>;

// ─────────────────────────────────────────────────────────────────────────────
// 10. ThemeMetadata — marketplace / catalog fields (Section 6)
// ─────────────────────────────────────────────────────────────────────────────

export const ThemeCategory = z.enum([
  "restaurants",
  "hospitality",
  "ecommerce",
  "portfolio",
  "professional-services",
  "health-wellness",
  "beauty",
  "education",
  "nonprofit",
  "events",
  "tech-saas",
  "blog",
  "construction",
]);
export type ThemeCategory = z.infer<typeof ThemeCategory>;

export const DesignStyle = z.enum([
  "minimal",
  "editorial",
  "bold",
  "organic",
  "corporate",
  "playful",
  "luxury",
  "industrial",
]);
export type DesignStyle = z.infer<typeof DesignStyle>;

export const ColorMood = z.enum([
  "warm",
  "cool",
  "neutral",
  "vibrant",
  "dark",
  "pastel",
]);
export type ColorMood = z.infer<typeof ColorMood>;

export const ThemeMetadata = z
  .object({
    /** Stable slug, lowercase-kebab — mirrors the directory name. */
    slug: z
      .string()
      .regex(/^[a-z][a-z0-9-]*$/, "Theme slug must be kebab-case")
      .min(2)
      .max(64),
    /** Marketplace display name. */
    name: z.string().min(2).max(80),
    /** One-line tagline for the marketplace card. */
    tagline: z.string().max(160).optional(),
    category: ThemeCategory,
    subcategory: z.string().min(2).max(64),
    tags: z.array(z.string().min(1).max(32)).max(16).default([]),
    targetIndustry: z.string().min(2).max(64),
    designStyle: DesignStyle,
    colorMood: ColorMood,
    /** Relative path to the marketplace screenshot (e.g. 'screenshot.png'). */
    screenshot: z.string().min(1).max(256),
    /** Optional preview gallery. */
    gallery: z.array(z.string().min(1).max(256)).max(12).default([]),
    /** Authors / vendors, marketplace attribution. */
    authors: z.array(z.string().min(1).max(64)).max(8).default([]),
    /** Schema version — bump when the theme is migrated. */
    version: z
      .string()
      .regex(/^\d+\.\d+\.\d+$/, "Version must be semver (e.g. 1.0.0)")
      .default("1.0.0"),
    /** WCAG claim used by the marketplace filter. */
    wcagLevel: z.enum(["A", "AA", "AAA"]).default("AA"),
  })
  .strict();
export type ThemeMetadata = z.infer<typeof ThemeMetadata>;

// ─────────────────────────────────────────────────────────────────────────────
// 11. Theme — the top-level artifact shipped per category
// ─────────────────────────────────────────────────────────────────────────────

export const Theme = z
  .object({
    metadata: ThemeMetadata,
    settings: ThemeSettings,
    /** Exactly 3 presets per Section 6 quality bar. */
    presets: z
      .array(ThemePreset)
      .length(3, "Theme must ship exactly 3 presets (Bold / Minimal / Warm)"),
    /** Optional markdown body used in the marketplace listing. */
    description: z.string().max(8000).optional(),
  })
  .strict();
export type Theme = z.infer<typeof Theme>;

// ─────────────────────────────────────────────────────────────────────────────
// 12. ThemeGeneratorParameters — input contract for the Theme Generator
//    (Task 2.26). The 10 design knobs from CLAUDE.md §6.5.
// ─────────────────────────────────────────────────────────────────────────────

export const PaletteName = z.enum([
  "warm",
  "luxury",
  "cool",
  "minimal",
  "bold",
  "organic",
]);
export type PaletteName = z.infer<typeof PaletteName>;

export const TypographyPairingName = z.enum([
  "luxury-serif",
  "modern-sans",
  "editorial",
  "friendly-sans",
  "bold-condensed",
]);
export type TypographyPairingName = z.infer<typeof TypographyPairingName>;

export const SpacingScale = z.enum(["compact", "comfortable", "spacious"]);
export type SpacingScale = z.infer<typeof SpacingScale>;

export const CornerRadius = z.enum(["sharp", "soft", "round"]);
export type CornerRadius = z.infer<typeof CornerRadius>;

export const AnimationStylePreset = z.enum(["none", "subtle", "bold"]);
export type AnimationStylePreset = z.infer<typeof AnimationStylePreset>;

export const ThemeGeneratorParameters = z
  .object({
    palette: PaletteName,
    typographyPairing: TypographyPairingName,
    spacingScale: SpacingScale,
    layoutDensity: LayoutDensity,
    cornerRadius: CornerRadius,
    shadowStyle: ShadowStyle,
    heroPattern: HeroPattern,
    headerStyle: HeaderStyle,
    footerStyle: FooterStyle,
    animationStyle: AnimationStylePreset,
    /** Free-form metadata — surfaced in the generated theme's `tags`. */
    contentType: z.string().min(1).max(64).optional(),
  })
  .strict();
export type ThemeGeneratorParameters = z.infer<typeof ThemeGeneratorParameters>;
