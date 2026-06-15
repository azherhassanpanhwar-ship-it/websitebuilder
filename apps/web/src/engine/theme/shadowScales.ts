/**
 * Shadow scales per `shadow_style` (CLAUDE.md §6.5 Design Law 8).
 *
 * The generator emits each scale as `--shadow-N` CSS variables. Tailwind
 * utilities like `shadow-md` resolve to `var(--shadow-md)` — never to raw
 * rgba.
 *
 * The `none` family returns "none" for every entry; the `subtle` family
 * keeps the default elevations; the `pronounced` family is for e-commerce,
 * hotels, and food where cards need stronger lift.
 */

export type ShadowStyle = "none" | "subtle" | "pronounced";

export const SHADOW_SCALES: Record<
  ShadowStyle,
  Record<
    "none" | "xs" | "sm" | "md" | "lg" | "xl" | "colored" | "inner",
    string
  >
> = {
  none: {
    none: "none",
    xs: "none",
    sm: "none",
    md: "none",
    lg: "none",
    xl: "none",
    colored: "none",
    inner: "none",
  },
  pronounced: {
    colored: "0 12px 32px rgba(0, 0, 0, 0.35)",
    inner: "inset 0 4px 8px rgba(0, 0, 0, 0.1)",
    lg: "0 16px 32px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)",
    md: "0 8px 16px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.08)",
    none: "none",
    sm: "0 4px 8px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)",
    xl: "0 24px 48px rgba(0, 0, 0, 0.18), 0 12px 24px rgba(0, 0, 0, 0.12)",
    xs: "0 2px 4px rgba(0, 0, 0, 0.08)",
  },
  subtle: {
    colored: "0 8px 24px rgba(0, 0, 0, 0.25)",
    inner: "inset 0 2px 4px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)",
    none: "none",
    sm: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
    xl: "0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)",
    xs: "0 1px 2px rgba(0, 0, 0, 0.05)",
  },
};
