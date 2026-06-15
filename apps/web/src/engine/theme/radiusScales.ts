/**
 * Corner-radius scales per `corner_radius` (CLAUDE.md §6.5 Design Law 7).
 *
 * The generator emits these directly as `--radius-N` CSS variables. The
 * tailwind config (ThemeGenerator.renderTailwindConfig) maps Tailwind
 * `rounded-*` utilities to these `var(--radius-*)` references — never to
 * raw px.
 *
 * Three families:
 *   - sharp   (law, architecture, fine-dining dark, editorial)
 *   - soft    (default — safe universal)
 *   - round   (bakery, wellness, kids, ice cream)
 */

export type RadiusFamily = "sharp" | "soft" | "round";

export const RADIUS_SCALES: Record<
  RadiusFamily,
  Record<"none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full", string>
> = {
  round: {
    none: "0px",
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "40px",
    full: "9999px",
  },
  sharp: {
    none: "0px",
    xs: "0px",
    sm: "0px",
    md: "2px",
    lg: "4px",
    xl: "6px",
    "2xl": "8px",
    full: "9999px",
  },
  soft: {
    none: "0px",
    xs: "2px",
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    "2xl": "24px",
    full: "9999px",
  },
};
