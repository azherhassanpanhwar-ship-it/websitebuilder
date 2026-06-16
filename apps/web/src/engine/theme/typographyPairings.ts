/**
 * Named typography pairings for the LATTICE Theme Generator.
 *
 * Each pairing is a curated display + body font family pair from CLAUDE.md
 * §6.5 Design Law 2 (Typography Pairing Matrix). Font stacks include a
 * generic fallback so the page renders even before the custom font loads.
 *
 * Weights are *not* CSS values — they are the body / display / bold weights
 * the theme intends to load. The generator emits them as integers so the
 * Customizer (Task 2.31) can pre-populate next/font weight arrays.
 */

export interface TypographyPairing {
  display: string;
  body: string;
  mono?: string;
  weights: { regular: number; medium: number; bold: number };
  /**
   * Modular scale ratio (Design Law 2). 1.25 — small editorial,
   * 1.333 — standard, 1.5 — dramatic.
   */
  scaleRatio: number;
  bodyLineHeight: number;
  displayLineHeight: number;
}

export type TypographyPairingName =
  | "luxury-serif"
  | "modern-sans"
  | "editorial"
  | "friendly-sans"
  | "bold-condensed";

export const TYPOGRAPHY_PAIRINGS: Record<TypographyPairingName, TypographyPairing> = {
  "bold-condensed": {
    display: '"Barlow Condensed", "Oswald", system-ui, sans-serif',
    body: '"Barlow", "DM Sans", system-ui, sans-serif',
    weights: { regular: 400, medium: 500, bold: 700 },
    scaleRatio: 1.25,
    bodyLineHeight: 1.5,
    displayLineHeight: 1.0,
  },
  editorial: {
    display: '"Lora", "Libre Baskerville", Georgia, serif',
    body: '"Inter", "Source Serif Pro", Georgia, serif',
    weights: { regular: 400, medium: 500, bold: 700 },
    scaleRatio: 1.333,
    bodyLineHeight: 1.7,
    displayLineHeight: 1.15,
  },
  "friendly-sans": {
    display: '"Plus Jakarta Sans", "Nunito", system-ui, sans-serif',
    body: '"Nunito Sans", "DM Sans", system-ui, sans-serif',
    weights: { regular: 400, medium: 500, bold: 700 },
    scaleRatio: 1.25,
    bodyLineHeight: 1.6,
    displayLineHeight: 1.15,
  },
  "luxury-serif": {
    display: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
    body: '"Inter", "DM Sans", system-ui, sans-serif',
    weights: { regular: 400, medium: 500, bold: 700 },
    scaleRatio: 1.333,
    bodyLineHeight: 1.6,
    displayLineHeight: 1.1,
  },
  "modern-sans": {
    display: '"Space Grotesk", "Neue Haas Unica", "DM Sans", system-ui, sans-serif',
    body: '"Inter", "IBM Plex Sans", system-ui, sans-serif',
    weights: { regular: 400, medium: 500, bold: 700 },
    scaleRatio: 1.25,
    bodyLineHeight: 1.6,
    displayLineHeight: 1.15,
  },
};
