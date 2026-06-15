/**
 * Named color palettes for the LATTICE Theme Generator.
 *
 * Each palette is a complete ColorPalette — a primary + accent ramp (50/100/
 * 500/900), foreground colors, surfaces, text, border, focus, and feedback
 * (error/success). Values here are the *source of truth* — they are the only
 * place in the generator where literal hex codes are allowed. The generator
 * emits them into CSS custom properties (`--color-primary-500`, etc.); the
 * output tailwind.config.ts contains only `var(--color-*)` references.
 *
 * Per CLAUDE.md §6.5 Design Law 1 (Color Psychology by Category), palettes
 * are intentionally aligned with industry mood. A theme can override any
 * color via a preset's overrides (see ThemeSchema.ThemePreset).
 */

export interface ColorRamp {
  /** Lightest tint — backgrounds, hover. */
  "50": string;
  /** Light tint — soft surfaces, secondary fills. */
  "100": string;
  /** Brand color — buttons, links, accents. */
  "500": string;
  /** Darkest shade — text on light, hover on dark. */
  "900": string;
}

export interface ColorPalette {
  primary: ColorRamp;
  /** Foreground (text/icon) color when rendered on `primary` surfaces. */
  onPrimary: string;
  accent: ColorRamp;
  onAccent: string;
  /** Default page / card surface. */
  surface: string;
  /** Alternate surface (sidebar, panel). */
  surfaceAlt: string;
  /** Dark surface (footers, inverse blocks). */
  surfaceDark: string;
  /** Default body text. */
  text: string;
  /** Muted / helper text. */
  textMuted: string;
  /** Hairline / divider. */
  border: string;
  /** Focus ring (must hit WCAG 3:1 against any surface). */
  focusRing: string;
  /** Error state. */
  error: string;
  /** Success state. */
  success: string;
}

export type PaletteName =
  | "warm"
  | "luxury"
  | "cool"
  | "minimal"
  | "bold"
  | "organic";

/**
 * The lookup table. Order is stable (alphabetical for determinism in
 * serialized output) and never mutated at runtime.
 */
export const PALETTES: Record<PaletteName, ColorPalette> = {
  bold: {
    primary: { "50": "#FFF1E5", "100": "#FFD0A8", "500": "#E8670A", "900": "#5A1F0A" },
    onPrimary: "#FFFFFF",
    accent: { "50": "#E5FFE5", "100": "#A8FFA8", "500": "#39FF14", "900": "#0A5A0A" },
    onAccent: "#0D0D0D",
    surface: "#FFFFFF",
    surfaceAlt: "#F5F5F5",
    surfaceDark: "#0D0D0D",
    text: "#0D0D0D",
    textMuted: "#5A5A5A",
    border: "#E0E0E0",
    focusRing: "#E8670A",
    error: "#D32F2F",
    success: "#388E3C",
  },
  cool: {
    primary: { "50": "#E5F0FF", "100": "#A8C8FF", "500": "#0066FF", "900": "#0A1A5A" },
    onPrimary: "#FFFFFF",
    accent: { "50": "#E5F8FA", "100": "#A8E0E8", "500": "#00B8D4", "900": "#0A4A5A" },
    onAccent: "#0A0E1A",
    surface: "#FFFFFF",
    surfaceAlt: "#F5F7FA",
    surfaceDark: "#0A0E1A",
    text: "#0A0E1A",
    textMuted: "#5A5A5A",
    border: "#E1E5EB",
    focusRing: "#0066FF",
    error: "#D32F2F",
    success: "#2E7D32",
  },
  luxury: {
    primary: { "50": "#FAF3E5", "100": "#E8D8A8", "500": "#B8975A", "900": "#3A2C1A" },
    onPrimary: "#FFFFFF",
    accent: { "50": "#F5E0E5", "100": "#D4A8B5", "500": "#6B1F2E", "900": "#2A0A12" },
    onAccent: "#F7F3EC",
    surface: "#F7F3EC",
    surfaceAlt: "#EFE8DA",
    surfaceDark: "#0D1B2A",
    text: "#0D1B2A",
    textMuted: "#5A5A5A",
    border: "#DDD0B5",
    focusRing: "#B8975A",
    error: "#A93226",
    success: "#1E8449",
  },
  minimal: {
    primary: { "50": "#F5F5F5", "100": "#E0E0E0", "500": "#111111", "900": "#000000" },
    onPrimary: "#FFFFFF",
    accent: { "50": "#F5F5F5", "100": "#DDDDDD", "500": "#666666", "900": "#222222" },
    onAccent: "#FFFFFF",
    surface: "#FAFAFA",
    surfaceAlt: "#F0F0F0",
    surfaceDark: "#0A0A0A",
    text: "#111111",
    textMuted: "#666666",
    border: "#E5E5E5",
    focusRing: "#111111",
    error: "#B00020",
    success: "#2E7D32",
  },
  organic: {
    primary: { "50": "#EDF4F0", "100": "#C8DDD3", "500": "#7BAF9E", "900": "#2C3A2E" },
    onPrimary: "#FFFFFF",
    accent: { "50": "#F5E8E8", "100": "#E8C8C8", "500": "#D4A9A9", "900": "#5A3A3A" },
    onAccent: "#2C3A2E",
    surface: "#F9F5EE",
    surfaceAlt: "#F0E8DC",
    surfaceDark: "#2C3A2E",
    text: "#2C3A2E",
    textMuted: "#6B6B6B",
    border: "#DDD3C0",
    focusRing: "#7BAF9E",
    error: "#A65A4A",
    success: "#5A8F5A",
  },
  warm: {
    primary: { "50": "#FDF8F3", "100": "#FAEFE0", "500": "#C9A84C", "900": "#3A2C1A" },
    onPrimary: "#1A1A1A",
    accent: { "50": "#FFF5F0", "100": "#FFE4D5", "500": "#C66B3D", "900": "#5A1F0A" },
    onAccent: "#FFFFFF",
    surface: "#FDF8F3",
    surfaceAlt: "#F5EBD9",
    surfaceDark: "#1A1A1A",
    text: "#1A1A1A",
    textMuted: "#5A5A5A",
    border: "#E5D8C0",
    focusRing: "#C9A84C",
    error: "#C0392B",
    success: "#27AE60",
  },
};
