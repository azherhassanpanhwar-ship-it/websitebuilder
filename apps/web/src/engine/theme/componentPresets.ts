/**
 * Component-level preset lookups — hero, header, footer.
 *
 * Every visual value in these presets is a *TokenRef* (a CSS custom
 * property name, never a raw px / hex). The generator resolves the ref at
 * build time and writes the full preset into the tokens doc.
 *
 * These lookups are static — there is no AI, no runtime branching beyond
 * the enum match.
 */

// SectionLayout is owned by src/crdt/SiteTree (Task 1.3, unmerged PR #3).
// We re-declare it locally as a string alias so this module has no cross-PR
// dependency. The generator emits a string into the tokens doc, which is
// all the consumer needs.
export type SectionLayout =
  | "full-bleed"
  | "contained"
  | "split"
  | "grid"
  | "stack";

export interface HeroPreset {
  pattern: string;
  minHeight: string;
  overlay?: string;
  alignment: "top" | "center" | "bottom";
}

export interface HeaderPreset {
  style: string;
  height: string;
  background: string;
  foreground: string;
}

export interface FooterPreset {
  style: string;
  background: string;
  foreground: string;
  newsletter: boolean;
}

// ─── Hero patterns (Design Law 4) ─────────────────────────────────────────

export type HeroPatternKey =
  | "full-bleed-image"
  | "split-image-text"
  | "centered-text-image"
  | "gallery-grid"
  | "animated-interactive"
  | "video-background"
  | "device-mockup"
  | "dark-moody"
  | "minimal-text"
  | "illustrated";

export const HERO_PRESETS: Record<HeroPatternKey, HeroPreset> = {
  "animated-interactive": {
    alignment: "center",
    minHeight: "--space-10",
    overlay: "--hero-overlay-animated",
    pattern: "animated-interactive",
  },
  "centered-text-image": {
    alignment: "center",
    minHeight: "--space-10",
    overlay: "--hero-overlay-centered",
    pattern: "centered-text-image",
  },
  "dark-moody": {
    alignment: "bottom",
    minHeight: "--space-11",
    overlay: "--hero-overlay-moody",
    pattern: "dark-moody",
  },
  "device-mockup": {
    alignment: "center",
    minHeight: "--space-10",
    overlay: "--hero-overlay-mockup",
    pattern: "device-mockup",
  },
  "full-bleed-image": {
    alignment: "bottom",
    minHeight: "--space-11",
    overlay: "--hero-overlay-full-bleed",
    pattern: "full-bleed-image",
  },
  "gallery-grid": {
    alignment: "center",
    minHeight: "--space-10",
    overlay: "--hero-overlay-grid",
    pattern: "gallery-grid",
  },
  illustrated: {
    alignment: "center",
    minHeight: "--space-10",
    overlay: "--hero-overlay-illustrated",
    pattern: "illustrated",
  },
  "minimal-text": {
    alignment: "center",
    minHeight: "--space-9",
    overlay: "--hero-overlay-minimal",
    pattern: "minimal-text",
  },
  "split-image-text": {
    alignment: "center",
    minHeight: "--space-10",
    overlay: "--hero-overlay-split",
    pattern: "split-image-text",
  },
  "video-background": {
    alignment: "center",
    minHeight: "--space-11",
    overlay: "--hero-overlay-video",
    pattern: "video-background",
  },
};

// ─── Header styles (Design Law 5) ──────────────────────────────────────────

export type HeaderStyleKey =
  | "transparent-over-hero"
  | "solid-sticky"
  | "centered-logo"
  | "split-nav"
  | "minimal-bar";

export const HEADER_PRESETS: Record<HeaderStyleKey, HeaderPreset> = {
  "centered-logo": {
    background: "--color-surface",
    foreground: "--color-text",
    height: "--space-8",
    style: "centered-logo",
  },
  "minimal-bar": {
    background: "--color-surface-alt",
    foreground: "--color-text",
    height: "--space-6",
    style: "minimal-bar",
  },
  "solid-sticky": {
    background: "--color-surface",
    foreground: "--color-text",
    height: "--space-7",
    style: "solid-sticky",
  },
  "split-nav": {
    background: "--color-surface",
    foreground: "--color-text",
    height: "--space-8",
    style: "split-nav",
  },
  "transparent-over-hero": {
    background: "--color-surface-translucent",
    foreground: "--color-text",
    height: "--space-8",
    style: "transparent-over-hero",
  },
};

// ─── Footer styles (Design Law 5) ──────────────────────────────────────────

export type FooterStyleKey =
  | "compact"
  | "expanded"
  | "multi-column"
  | "centered-minimal";

export const FOOTER_PRESETS: Record<FooterStyleKey, FooterPreset> = {
  "centered-minimal": {
    background: "--color-surface-alt",
    foreground: "--color-text-muted",
    newsletter: false,
    style: "centered-minimal",
  },
  compact: {
    background: "--color-surface-dark",
    foreground: "--color-text-muted",
    newsletter: false,
    style: "compact",
  },
  expanded: {
    background: "--color-surface-dark",
    foreground: "--color-text-muted",
    newsletter: false,
    style: "expanded",
  },
  "multi-column": {
    background: "--color-surface-dark",
    foreground: "--color-text-muted",
    newsletter: true,
    style: "multi-column",
  },
};

// Re-export SectionLayout to avoid a circular import in callers.
// (Local declaration; see top-of-file comment.)
export {};
