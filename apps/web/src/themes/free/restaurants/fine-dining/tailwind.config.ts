import type { Config } from "tailwindcss";

/**
 * LATTICE Theme #1 — Fine Dining
 * Tailwind alias map for the theme tokens declared in `tokens.json`.
 *
 * Skill 2 — W3C Design Tokens
 *   Every key below maps to a `var(--token-*)` reference. No hex / px
 *   literals — the literal atomic values live in tokens.json (Step A).
 *
 * Usage
 *   1. ThemeProvider injects the `css` group from tokens.json as `:root`
 *      CSS custom properties.
 *   2. This config aliases every visual primitive to the corresponding
 *      `var(--*)`, so consumers can use clean Tailwind utilities
 *      (`bg-primary`, `text-on-primary`, `rounded-md`, etc.) instead of
 *      the raw `bg-[var(--color-primary)]` form.
 *   3. Components MAY also use the raw `var(--*)` form when an
 *      arbitrary value is needed (`shadow-[var(--shadow-md)]`).
 *
 * Merging
 *   To activate the theme in a host project, spread this config into
 *   the host's `tailwind.config.ts`:
 *
 *     import fineDiningConfig from "./src/themes/free/restaurants/fine-dining/tailwind.config";
 *     export default {
 *       presets: [fineDiningConfig],
 *       content: [...],
 *     };
 *
 *   The host's own `theme.extend` entries still win (preset rules merge
 *   in front of the host's overrides).
 */
const config: Config = {
  content: [
    // The theme's own components
    "./src/themes/free/restaurants/fine-dining/**/*.{ts,tsx,js,jsx,mdx}",
    // Apps that consume the theme
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      inherit: "inherit",

      // ─── Primary ramp (deep gold) — Design Law 1 ──────────────────────
      primary: {
        50: "var(--color-primary-50)",
        100: "var(--color-primary-100)",
        200: "var(--color-primary-200)",
        300: "var(--color-primary-300)",
        DEFAULT: "var(--color-primary-500)",
        500: "var(--color-primary-500)",
        700: "var(--color-primary-700)",
        900: "var(--color-primary-900)",
      },
      "on-primary": "var(--color-on-primary)",

      // ─── Accent (burgundy) — Design Law 1 secondary ───────────────────
      accent: {
        DEFAULT: "var(--color-accent)",
      },
      "on-accent": "var(--color-on-accent)",

      // ─── Surfaces (warm whites / creams) ──────────────────────────────
      surface: {
        DEFAULT: "var(--color-surface)",
        alt: "var(--color-surface-alt)",
        dark: "var(--color-surface-dark)",
      },

      // ─── Text (deep brown / warm gray) ────────────────────────────────
      fg: {
        DEFAULT: "var(--color-text)",
        muted: "var(--color-text-muted)",
      },

      // ─── Border + focus ring ──────────────────────────────────────────
      border: "var(--color-border)",
      focus: "var(--color-focus-ring)",

      // ─── Status ───────────────────────────────────────────────────────
      error: "var(--color-error)",
      success: "var(--color-success)",
    },

    fontFamily: {
      display: "var(--font-display)",
      body: "var(--font-body)",
      mono: "var(--font-mono)",
    },

    fontWeight: {
      display: "var(--font-weight-display)",
      regular: "var(--font-weight-body-regular)",
      medium: "var(--font-weight-body-medium)",
      semibold: "var(--font-weight-body-semibold)",
    },

    lineHeight: {
      display: "var(--line-height-display)",
      subhead: "var(--line-height-subhead)",
      body: "var(--line-height-body)",
      caption: "var(--line-height-caption)",
    },

    letterSpacing: {
      display: "var(--letter-spacing-display)",
      body: "var(--letter-spacing-body)",
      eyebrow: "var(--letter-spacing-eyebrow)",
    },

    spacing: {
      0: "var(--space-0)",
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
      none: "var(--radius-none)",
      xs: "var(--radius-xs)",
      sm: "var(--radius-sm)",
      DEFAULT: "var(--radius-md)",
      md: "var(--radius-md)",
      lg: "var(--radius-lg)",
      xl: "var(--radius-xl)",
      "2xl": "var(--radius-2xl)",
      full: "var(--radius-full)",
    },

    boxShadow: {
      none: "var(--shadow-none)",
      xs: "var(--shadow-xs)",
      sm: "var(--shadow-sm)",
      DEFAULT: "var(--shadow-sm)",
      md: "var(--shadow-md)",
      lg: "var(--shadow-lg)",
      xl: "var(--shadow-xl)",
      colored: "var(--shadow-colored)",
      inner: "var(--shadow-inner)",
    },

    transitionDuration: {
      fast: "var(--duration-fast)",
      DEFAULT: "var(--duration-base)",
      base: "var(--duration-base)",
      enter: "var(--duration-enter)",
      page: "var(--duration-page)",
    },

    transitionTimingFunction: {
      DEFAULT: "var(--easing-standard)",
      standard: "var(--easing-standard)",
      decelerate: "var(--easing-decelerate)",
      accelerate: "var(--easing-accelerate)",
      spring: "var(--easing-spring)",
    },

    extend: {
      // Hero overlay gradient stops (Design Law 4 full-bleed-image)
      backgroundImage: {
        "hero-fade":
          "linear-gradient(180deg, var(--hero-overlay-from) 0%, var(--hero-overlay-to) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
