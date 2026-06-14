import type { Config } from "tailwindcss";

/**
 * LATTICE Tailwind config (Phase 0 scaffold).
 *
 * Skill 2 — W3C Design Tokens
 *   The 500-theme engine is entirely token-driven. Components must NEVER
 *   hardcode hex / px values — they consume CSS custom properties declared
 *   in `src/tokens/base.tokens.json` (Task 1.18) and exposed as Tailwind
 *   aliases here.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}", "../../src/**/*.{ts,tsx,js,jsx,mdx}"],
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
      primary: "var(--color-primary)",
      "on-primary": "var(--color-on-primary)",
      accent: "var(--color-accent)",
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
      spring: "var(--easing-spring)",
    },
    extend: {},
  },
  plugins: [],
};

export default config;
