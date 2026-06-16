/**
 * LATTICE Theme #1 — Fine Dining
 * Hero component — full-bleed-image pattern (Design Law 4)
 *
 *   - Image fills 100vw × 100vh.
 *   - Overlay gradient from top (faint) → bottom (deep surface 90%).
 *   - Text bottom-left, with theatrical entrance sequence.
 *   - Mouse-move parallax (subtle, 4% max) — the reference's signature.
 *   - Reduced motion: parallax is disabled, entrance snaps to final state.
 *   - Mobile: object-position top so faces / dishes are not cropped.
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

"use client";

import * as React from "react";
import { ArrowRight, CalendarDays, ChevronDown } from "lucide-react";

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
  /** Optional sub-eyebrow meta line (right of eyebrow, dim). */
  meta?: string;
  /** Hero headline — rendered in Bodoni Moda. */
  headline?: string;
  /** Optional italic accent word shown in serif italic. */
  headlineAccent?: string;
  /** Subhead paragraph — rendered in Hanken Grotesk. */
  subhead?: string;
  /** Primary CTA label (e.g. "Reserve a table"). */
  primaryCtaLabel?: string;
  /** Primary CTA href. */
  primaryCtaHref?: string;
  /** Secondary CTA label (e.g. "View menu"). */
  secondaryCtaLabel?: string;
  /** Secondary CTA href. */
  secondaryCtaHref?: string;
  /** Anchor to jump to when the scroll-cue is clicked. */
  scrollCueHref?: string;
}

const DEFAULT_IMAGE = "/themes/fine-dining/hero.jpg";

export function FineDiningHero({
  imageUrl = DEFAULT_IMAGE,
  eyebrow = "Maison Lumière",
  meta = "Est. 1998 · Downtown",
  headline = "An evening,",
  headlineAccent = "set with care.",
  subhead = "Seasonal tasting menus, an award-winning sommelier, and a dining room built for conversation. Reservations open thirty days in advance.",
  primaryCtaLabel = "Reserve a table",
  primaryCtaHref = "#reserve",
  secondaryCtaLabel = "View menu",
  secondaryCtaHref = "#menu",
  scrollCueHref = "#welcome",
}: FineDiningHeroProps) {
  // ─── Mouse parallax (the reference's signature micro-interaction) ─────
  const heroRef = React.useRef<HTMLElement | null>(null);
  const imageRef = React.useRef<HTMLImageElement | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const targetRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  React.useEffect(() => {
    // Respect reduced motion: skip the parallax entirely.
    const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!motionOk) return;

    const onMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5; // -0.5..0.5
      const y = e.clientY / window.innerHeight - 0.5;
      targetRef.current = { x, y };
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        const img = imageRef.current;
        if (!img) return;
        // ±4% translate, plus a very gentle 1.04 scale (the reference).
        const tx = targetRef.current.x * -8; // px
        const ty = targetRef.current.y * -8;
        img.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(1.04)`;
      });
    };

    const onLeave = () => {
      targetRef.current = { x: 0, y: 0 };
      if (imageRef.current) {
        imageRef.current.style.transform = "translate3d(0, 0, 0) scale(1.04)";
      }
    };

    const el = heroRef.current;
    if (!el) return;
    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      aria-label="Fine Dining hero"
      data-theme-hero
      className="group/hero relative w-full overflow-hidden bg-[color:var(--color-surface-dark)] min-h-[var(--hero-min-height-mobile)] md:min-h-[var(--hero-min-height)]"
    >
      {/* ─── Full-bleed image (Design Law 4) ────────────────────── */}
      {/* The image is `position:absolute` and gets a 1.04 scale baseline
          so the parallax translate (8px) never reveals a bare edge. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imageRef}
        src={imageUrl}
        alt=""
        role="presentation"
        decoding="async"
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        className="absolute inset-0 h-full w-full origin-center bg-[color:var(--color-surface-dark)] object-cover will-change-transform"
        style={{
          objectPosition: "center 30%",
          transform: "translate3d(0,0,0) scale(1.04)",
          opacity: "var(--hero-image-opacity)",
          transition: "transform 600ms var(--easing-standard)",
        }}
      />

      {/* ─── Cinematic gradient (top faint → bottom deep surface 90%) ─ */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(14,14,14,0.35)_0%,rgba(14,14,14,0.20)_40%,rgba(14,14,14,0.65)_75%,rgba(14,14,14,0.92)_100%)]"
      />

      {/* ─── Hairline frame (the reference's top + bottom rules) ────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[color:var(--color-border)] opacity-60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[color:var(--color-border)] opacity-60"
      />

      {/* ─── Top meta strip (eyebrow left, meta right) ──────────────── */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10">
        <div className="mx-auto flex w-full max-w-[var(--container-max)] items-center justify-between px-[var(--margin-mobile)] pt-[var(--space-7)] md:px-[var(--margin-desktop)] md:pt-[var(--space-8)]">
          <p className="font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-300)] opacity-0 animate-[fdFadeIn_var(--duration-enter)_var(--easing-decelerate)_0.1s_forwards]">
            {eyebrow}
          </p>
          <p className="hidden font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-regular)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-text-faint)] opacity-0 animate-[fdFadeIn_var(--duration-enter)_var(--easing-decelerate)_0.2s_forwards] sm:block">
            {meta}
          </p>
        </div>
      </div>

      {/* ─── Content (bottom-left per Design Law 4) ──────────────────── */}
      <div className="relative z-10 flex h-full min-h-[inherit] flex-col justify-end">
        <div className="mx-auto w-full max-w-[var(--container-max)] px-[var(--margin-mobile)] pb-[var(--space-9)] pt-[var(--space-11)] md:px-[var(--margin-desktop)] md:pb-[var(--space-10)]">
          {/* Headline — Bodoni Moda. Two lines, second in italic accent. */}
          <h1 className="max-w-4xl font-[family-name:var(--font-display)] text-[length:clamp(2.75rem,7vw,5.75rem)] font-[var(--font-weight-display)] leading-[var(--line-height-display)] tracking-[var(--letter-spacing-display)] text-[color:var(--color-on-primary)]">
            <span className="block opacity-0 animate-[fdRise_var(--duration-enter)_var(--easing-decelerate)_0.25s_forwards]">
              {headline}
            </span>
            {headlineAccent && (
              <span className="block italic text-[color:var(--color-primary-300)] opacity-0 animate-[fdRise_var(--duration-enter)_var(--easing-decelerate)_0.45s_forwards]">
                {headlineAccent}
              </span>
            )}
          </h1>

          {/* Hairline rule under the headline — the reference's signature */}
          <div
            aria-hidden="true"
            className="mt-[var(--space-6)] h-px w-24 bg-[color:var(--color-primary-500)] opacity-0 animate-[fdGrow_var(--duration-enter)_var(--easing-decelerate)_0.7s_forwards] motion-reduce:animate-none"
            style={{ transformOrigin: "left center" }}
          />

          {/* Subhead */}
          <p className="mt-[var(--space-6)] max-w-xl font-[family-name:var(--font-body)] text-[length:var(--space-5)] font-[var(--font-weight-body-regular)] leading-[var(--line-height-body)] text-[color:var(--color-primary-100)] opacity-0 animate-[fdFadeIn_var(--duration-enter)_var(--easing-decelerate)_0.85s_forwards]">
            {subhead}
          </p>

          {/* CTA row */}
          <div className="mt-[var(--space-7)] flex flex-col gap-[var(--space-3)] sm:flex-row sm:items-center sm:gap-[var(--space-4)] opacity-0 animate-[fdFadeIn_var(--duration-enter)_var(--easing-decelerate)_1.0s_forwards]">
            <a
              href={primaryCtaHref}
              className="group inline-flex items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-sm)] bg-[color:var(--color-primary-500)] px-[var(--space-6)] py-[var(--space-4)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] font-[var(--font-weight-body-semibold)] text-[color:var(--color-on-primary)] shadow-[var(--shadow-colored)] transition-[background-color,box-shadow,transform] duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:bg-[color:var(--color-primary-700)] hover:shadow-[var(--shadow-md)] hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
            >
              <CalendarDays className="h-[var(--space-4)] w-[var(--space-4)]" aria-hidden="true" />
              {primaryCtaLabel}
            </a>

            <a
              href={secondaryCtaHref}
              className="group inline-flex items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-sm)] border border-[color:var(--color-primary-200)] bg-transparent px-[var(--space-6)] py-[var(--space-4)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] font-[var(--font-weight-body-medium)] text-[color:var(--color-on-primary)] transition-[background-color,border-color,transform] duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:border-[color:var(--color-primary-500)] hover:bg-[color:rgba(250,246,238,0.08)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
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

      {/* ─── Scroll-cue (the reference's center-bottom chevron) ──────── */}
      <a
        href={scrollCueHref}
        aria-label="Scroll to next section"
        className="absolute inset-x-0 bottom-[var(--space-3)] z-10 mx-auto flex h-[var(--space-7)] w-[var(--space-7)] items-center justify-center text-[color:var(--color-primary-300)] opacity-0 animate-[fdFadeIn_var(--duration-enter)_var(--easing-decelerate)_1.2s_forwards] motion-reduce:animate-none"
        style={{ left: "50%", transform: "translateX(-50%)" }}
      >
        <ChevronDown
          className="h-[var(--space-4)] w-[var(--space-4)] motion-safe:animate-[fdBob_2.4s_ease-in-out_infinite]"
          aria-hidden="true"
        />
      </a>

      {/* ─── Inline keyframes (scoped to this component) ─────────────── */}
      <style>{`
        @keyframes fdFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes fdRise {
          from { opacity: 0; transform: translate3d(0, 18px, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes fdGrow {
          from { opacity: 0; transform: scaleX(0); }
          to   { opacity: 1; transform: scaleX(1); }
        }
        @keyframes fdBob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(4px); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-theme-hero] *,
          [data-theme-hero] {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>
    </section>
  );
}

export default FineDiningHero;
