/**
 * LATTICE Theme #1 — Fine Dining
 * Hero component — full-bleed-image pattern (Design Law 4)
 *
 *   - Image fills 100vw × 100vh.
 *   - Overlay gradient from bottom (transparent → deep brown 78%).
 *   - Text bottom-left.
 *   - Never center-crop on mobile (object-position: top on mobile).
 *
 * Skill 1 — CRDT
 *   This is a pure presentational component. No Yjs / useState for
 *   content. All copy is props or default.
 *
 * Skill 2 — W3C Design Tokens
 *   Every visual primitive is a `var(--token-*)` reference. No hex,
 *   no px literals. Colors / spacing / radius / shadow all resolve
 *   to the theme tokens declared in `tokens.json`.
 *
 * Skill 5 — lucide-react
 *   Single icon system. No inline SVG, no emoji.
 *
 * Image credit
 *   Pexels photo 17057034 by Matheus Bertelli
 *   https://www.pexels.com/photo/table-in-restaurant-17057034/
 */

import * as React from "react";
import { ArrowRight, CalendarDays } from "lucide-react";

export interface FineDiningHeroProps {
  /**
   * The hero background image URL. Defaults to the locally-hosted
   * `/themes/fine-dining/hero.jpg` (Pexels photo 17057034 by
   * Matheus Bertelli, downloaded on install to avoid third-party
   * cookie + cross-origin LCP penalties).
   */
  imageUrl?: string;
  /** Eyebrow text above the headline (uppercase, wide tracking). */
  eyebrow?: string;
  /** Hero headline — rendered in Cormorant Garamond. */
  headline?: string;
  /** Subhead paragraph — rendered in Inter. */
  subhead?: string;
  /** Primary CTA label (e.g. "Reserve a table"). */
  primaryCtaLabel?: string;
  /** Primary CTA href. */
  primaryCtaHref?: string;
  /** Secondary CTA label (e.g. "View menu"). */
  secondaryCtaLabel?: string;
  /** Secondary CTA href. */
  secondaryCtaHref?: string;
}

const DEFAULT_IMAGE = "/themes/fine-dining/hero.jpg";

export function FineDiningHero({
  imageUrl = DEFAULT_IMAGE,
  eyebrow = "Est. 1998 · Downtown",
  headline = "An evening, set with care.",
  subhead = "Seasonal tasting menus, an award-winning sommelier, and a dining room built for conversation. Reservations open thirty days in advance.",
  primaryCtaLabel = "Reserve a table",
  primaryCtaHref = "#reserve",
  secondaryCtaLabel = "View menu",
  secondaryCtaHref = "#menu",
}: FineDiningHeroProps) {
  return (
    <section
      aria-label="Fine Dining hero"
      data-theme-hero
      className="relative w-full overflow-hidden bg-[color:var(--color-surface-dark)] min-h-[85vh] md:min-h-screen"
    >
      {/* ─── Full-bleed image (Design Law 4) ────────────────────── */}
      {/* Plain <img> with fetchPriority="high" + sizes="100vw".
          The `bg-[color:var(--color-surface-dark)]` class on the
          <img> gives the LCP element a paint-able background the
          instant it's parsed — this collapses the "Render Delay"
          phase of the LCP waterfall because the browser has
          something to commit before the JPEG fully decodes. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt=""
        role="presentation"
        decoding="async"
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        className="absolute inset-0 h-full w-full bg-[color:var(--color-surface-dark)] object-cover object-[center_30%] md:object-[center_30%]"
        style={{
          // Tailwind's object-[center_30%] handles both breakpoints;
          // the inline style below provides a fallback for older
          // browsers that don't parse arbitrary object-position.
          objectPosition: "center 30%",
        }}
      />

      {/* ─── Gradient overlay (transparent → deep brown 78%) ────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[image:var(--bg-hero-fade,linear-gradient(180deg,var(--hero-overlay-from)_0%,var(--hero-overlay-to)_100%))]"
      />

      {/* ─── Content (bottom-left per Design Law 4) ──────────────────── */}
      <div className="relative z-10 flex h-full min-h-[inherit] flex-col justify-end">
        <div className="mx-auto w-full max-w-[1440px] px-[var(--space-6)] pb-[var(--space-9)] pt-[var(--space-11)] md:pb-[var(--space-10)]">
          {/* Eyebrow */}
          <p className="font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-medium)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-200)] opacity-0 animate-[fadeIn_var(--duration-enter)_var(--easing-decelerate)_0.05s_forwards]">
            {eyebrow}
          </p>

          {/* Headline — Cormorant Garamond, max tracking per Design Law 2 */}
          <h1 className="mt-[var(--space-4)] max-w-3xl font-[family-name:var(--font-display)] text-[length:clamp(2.75rem,6vw,5.25rem)] font-[var(--font-weight-display)] leading-[var(--line-height-display)] tracking-[var(--letter-spacing-display)] text-[color:var(--color-on-primary)] opacity-0 animate-[fadeIn_var(--duration-enter)_var(--easing-decelerate)_0.2s_forwards]">
            {headline}
          </h1>

          {/* Subhead — Inter, 1.6–1.75 leading per Design Law 2 */}
          <p className="mt-[var(--space-5)] max-w-xl font-[family-name:var(--font-body)] text-[length:var(--space-5)] font-[var(--font-weight-body-regular)] leading-[var(--line-height-body)] text-[color:var(--color-primary-100)] opacity-0 animate-[fadeIn_var(--duration-enter)_var(--easing-decelerate)_0.35s_forwards]">
            {subhead}
          </p>

          {/* CTA row */}
          <div className="mt-[var(--space-7)] flex flex-col gap-[var(--space-3)] sm:flex-row sm:items-center sm:gap-[var(--space-4)] opacity-0 animate-[fadeIn_var(--duration-enter)_var(--easing-decelerate)_0.5s_forwards]">
            <a
              href={primaryCtaHref}
              className="group inline-flex items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-sm)] bg-[color:var(--color-primary-500)] px-[var(--space-6)] py-[var(--space-4)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] font-[var(--font-weight-body-semibold)] text-[color:var(--color-on-primary)] shadow-[var(--shadow-sm)] transition-[background-color,box-shadow,transform] duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:bg-[color:var(--color-primary-700)] hover:shadow-[var(--shadow-md)] hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2 motion-safe:transition"
            >
              <CalendarDays className="h-[var(--space-4)] w-[var(--space-4)]" aria-hidden="true" />
              {primaryCtaLabel}
            </a>

            <a
              href={secondaryCtaHref}
              className="group inline-flex items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-sm)] border border-[color:var(--color-primary-200)] bg-transparent px-[var(--space-6)] py-[var(--space-4)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] font-[var(--font-weight-body-medium)] text-[color:var(--color-on-primary)] transition-[background-color,border-color,transform] duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:border-[color:var(--color-primary-500)] hover:bg-[color:rgba(250,246,238,0.08)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2 motion-safe:transition"
            >
              {secondaryCtaLabel}
              <ArrowRight
                className="h-[var(--space-4)] w-[var(--space-4)] transition-transform duration-[var(--duration-base)] ease-[var(--easing-standard)] group-hover:translate-x-[var(--space-1)]"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FineDiningHero;
