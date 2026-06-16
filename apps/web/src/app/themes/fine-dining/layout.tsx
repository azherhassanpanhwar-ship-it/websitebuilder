/**
 * LATTICE Theme #1 — Fine Dining — Preview route layout
 *
 * Responsibilities
 *   1. Load the two type families via `next/font/google` (Design Law 12).
 *      Cormorant Garamond is bound to `--font-display`, Inter to
 *      `--font-body`. The Fine Dining components consume the same
 *      variable names declared in `tokens.json`.
 *   2. Emit the theme's resolved CSS custom properties on a wrapper
 *      so the components can read `var(--color-*)`, `var(--space-*)`,
 *      etc.
 *   3. Mount the shared `Header` and `Footer` for every page in the
 *      theme's preview.
 *   4. Set the `lang` attribute and a JSON-LD `Restaurant` block
 *      for SEO (quality bar item 7).
 *   5. Honor `prefers-reduced-motion` globally (Design Law 6).
 */

import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import baseTokens from "@/themes/free/restaurants/fine-dining/tokens.json";
import { FineDiningHeader } from "@/themes/free/restaurants/fine-dining/components/Header";
import { FineDiningFooter } from "@/themes/free/restaurants/fine-dining/components/Footer";

// ─── Fonts (Design Law 12: next/font/google only) ──────────────────────────
const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Maison Lumière — Fine Dining",
    template: "%s · Maison Lumière",
  },
  description:
    "Twenty-six years of one small dining room. Seasonal tasting menus, an award-winning sommelier, and a reservations-only flow in downtown New York.",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "Maison Lumière — Fine Dining",
    description:
      "Twenty-six years of one small dining room. Seasonal tasting menus, an award-winning sommelier, and a reservations-only flow in downtown New York.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF6EE",
  width: "device-width",
  initialScale: 1,
};

// ─── Token resolver (DTCG references → CSS custom property block) ──────────
type DtcgNode = Record<string, unknown>;

function resolveRef(ref: string, root: DtcgNode): string {
  const parts = ref.split(".");
  let cur: unknown = root;
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in (cur as DtcgNode)) {
      cur = (cur as DtcgNode)[p];
    } else {
      return ""; // Unresolvable — emit empty (will fall back at the consumer)
    }
  }
  return typeof cur === "string" || typeof cur === "number" ? String(cur) : "";
}

function walk(node: DtcgNode, root: DtcgNode, indent: string): string {
  const lines: string[] = [];
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("$")) continue;
    if (v && typeof v === "object" && "$value" in (v as DtcgNode)) {
      const leaf = v as { $value: string; $type?: string };
      let value = String(leaf.$value ?? "");
      value = value.replace(/\{([^}]+)\}/g, (_, ref: string) => resolveRef(ref, root));
      lines.push(`${indent}  ${k}: ${value};`);
    } else if (v && typeof v === "object") {
      lines.push(`${indent}${k} {`);
      lines.push(walk(v as DtcgNode, root, indent + "  "));
      lines.push(`${indent}}`);
    }
  }
  return lines.join("\n");
}

function buildRootCss(): string {
  // The base tokens are DTCG; the `css` group maps each `--token` to a
  // value. Walk it and emit a flat :root block.
  return `:root {\n${walk(baseTokens.css as DtcgNode, baseTokens as unknown as DtcgNode, "")}\n}\n`;
}

const RESTAURANT_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Maison Lumière",
  description:
    "A small dining room serving a single, considered tasting menu each evening. Seasonal produce, an award-winning sommelier, and reservations thirty days in advance.",
  servesCuisine: "French",
  priceRange: "$$$$",
  acceptsReservations: "True",
  address: {
    "@type": "PostalAddress",
    streetAddress: "12 Rue de la Paix",
    addressLocality: "New York",
    addressRegion: "NY",
    postalCode: "10014",
    addressCountry: "US",
  },
  telephone: "+1-555-012-3456",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday"],
      opens: "17:30",
      closes: "21:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Friday", "Saturday"],
      opens: "17:30",
      closes: "22:30",
    },
  ],
};

// ─── Layout ──────────────────────────────────────────────────────────────
export default function FineDiningLayout({ children }: { children: React.ReactNode }) {
  const rootCss = buildRootCss();
  return (
    <div
      data-theme="fine-dining"
      className={`${display.variable} ${body.variable}`}
      style={{
        // Surface is the warm cream; everything inside reads from
        // --color-surface, --color-text, etc.
        backgroundColor: "var(--color-surface)",
        color: "var(--color-text)",
        fontFamily: "var(--font-body)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Preload the LCP hero image so the browser can start the
          network request in parallel with the HTML parse. Lighthouse
          Performance audit rewards the early LCP. */}
      <link rel="preload" as="image" href="/themes/fine-dining/hero.jpg" fetchPriority="high" />
      <style
        dangerouslySetInnerHTML={{
          __html:
            rootCss +
            // Design Law 6: respect reduced motion globally for the theme.
            `\n@media (prefers-reduced-motion: reduce) {\n` +
            `  [data-theme="fine-dining"] *, [data-theme="fine-dining"] *::before, [data-theme="fine-dining"] *::after {\n` +
            `    animation-duration: 0.01ms !important;\n` +
            `    animation-iteration-count: 1 !important;\n` +
            `    transition-duration: 0.01ms !important;\n` +
            `    scroll-behavior: auto !important;\n` +
            `  }\n` +
            `}\n`,
        }}
      />
      <script
        type="application/ld+json"
         
        dangerouslySetInnerHTML={{ __html: JSON.stringify(RESTAURANT_JSONLD) }}
      />
      <FineDiningHeader brandName="Maison Lumière" brandMark="ML" />
      <main id="top" style={{ flex: 1 }}>
        {children}
      </main>
      <FineDiningFooter brandName="Maison Lumière" brandMark="ML" />
    </div>
  );
}
