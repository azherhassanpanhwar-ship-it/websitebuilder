/**
 * LATTICE Theme #1 — Fine Dining
 * Hero component — full-bleed-image pattern (Design Law 4)
 *
 * Reference design language:
 *   - Image fills 100vw × 100vh.
 *   - Top-faint → bottom-deep cinematic gradient.
 *   - Eyebrow (gold, uppercase, wide tracking) above the headline.
 *   - Headline in Bodoni Moda, two lines, second line in italic accent.
 *   - Side-by-side CTAs: primary gold pill + outline ghost.
 *   - Bottom-center "Scroll to Discover" bounce cue.
 *   - Mouse-move parallax (subtle, 8px max) — the reference's signature.
 *   - Reduced motion: parallax disabled, entrance snaps to final state.
 *
 * Skill 1 — CRDT  ·  Skill 2 — W3C Design Tokens  ·  Skill 5 — lucide-react
 */

"use client";

import * as React from "react";
import { ArrowRight, ChevronDown } from "lucide-react";

export interface FineDiningHeroProps {
  /**
   * The hero background image URL. Defaults to the locally-hosted
   * `/themes/fine-dining/hero.jpg` (Pexels photo 17057034 by
   * Matheus Bertelli).
   */
  imageUrl?: string;
  /** Eyebrow text above the headline (uppercase, wide tracking). */
  eyebrow?: string;
  /** Hero headline line 1 (Bodoni Moda). */
  headline?: string;
  /** Hero headline line 2 — rendered in italic Bodoni accent. */
  headlineAccent?: string;
  /** Subhead paragraph — rendered in Hanken Grotesk. */
  subhead?: string;
  /** Primary CTA label. */
  primaryCtaLabel?: string;
  /** Primary CTA href. */
  primaryCtaHref?: string;
  /** Secondary CTA label. */
  secondaryCtaLabel?: string;
  /** Secondary CTA href. */
  secondaryCtaHref?: string;
  /** Scroll-cue target. */
  scrollCueHref?: string;
  /** Scroll-cue label. */
  scrollCueLabel?: string;
}

const DEFAULT_IMAGE = "/themes/fine-dining/hero.jpg";

export function FineDiningHero({
  imageUrl = DEFAULT_IMAGE,
  eyebrow = "An Intimate Culinary Journey",
  headline = "An evening,",
  headlineAccent = "set with care.",
  subhead = "Seasonal tasting menus, an award-winning sommelier, and a dining room built for conversation. Reservations open thirty days in advance.",
  primaryCtaLabel = "Reserve a table",
  primaryCtaHref = "#reserve",
  secondaryCtaLabel = "The Story",
  secondaryCtaHref = "#experience",
  scrollCueHref = "#welcome",
  scrollCueLabel = "Scroll to Discover",
}: FineDiningHeroProps) {
  // ─── Mouse parallax (the reference's signature micro-interaction) ─────
  const heroRef = React.useRef<HTMLElement | null>(null);
  const imageRef = React.useRef<HTMLImageElement | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const targetRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  React.useEffect(() => {
    const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!motionOk) return;

    const onMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      targetRef.current = { x, y };
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        const img = imageRef.current;
        if (!img) return;
        const tx = targetRef.current.x * -10;
        const ty = targetRef.current.y * -10;
        img.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(1.05)`;
      });
    };

    const onLeave = () => {
      targetRef.current = { x: 0, y: 0 };
      if (imageRef.current) {
        imageRef.current.style.transform = "translate3d(0, 0, 0) scale(1.05)";
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
          transform: "translate3d(0,0,0) scale(1.05)",
          opacity: "var(--hero-image-opacity)",
          transition: "transform 600ms var(--easing-standard)",
        }}
      />

      {/* ─── Cinematic gradient (top faint → bottom deep surface 92%) ─ */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(12,12,12,0.20)_0%,rgba(12,12,12,0.20)_40%,rgba(12,12,12,0.65)_75%,rgba(12,12,12,1)_100%)]"
      />

      {/* ─── Content — bottom-left, max 8/12 cols (the reference) ──── */}
      <div className="relative z-10 flex h-full min-h-[inherit] flex-col justify-end">
        <div className="mx-auto w-full max-w-[var(--container-max)] px-[var(--margin-mobile)] pb-[var(--space-10)] pt-[var(--space-11)] md:px-[var(--margin-desktop)] md:pb-[var(--space-11)]">
          <div className="grid grid-cols-12 gap-[var(--space-6)]">
            <div className="col-span-12 md:col-span-10 lg:col-span-8">
              {/* Eyebrow — gold, wide tracking */}
              <p className="font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[0.2em] text-[color:var(--color-primary-500)] opacity-0 animate-[fdFadeIn_var(--duration-enter)_var(--easing-decelerate)_0.1s_forwards]">
                {eyebrow}
              </p>

              {/* Headline — Bodoni Moda, two lines, second in italic accent */}
              <h1 className="mt-[var(--space-6)] font-[family-name:var(--font-display)] text-[length:clamp(2.75rem,7vw,5.75rem)] font-[var(--font-weight-display)] leading-[var(--line-height-display)] tracking-[var(--letter-spacing-display)] text-[color:var(--color-on-primary)]">
                <span className="block opacity-0 animate-[fdRise_var(--duration-enter)_var(--easing-decelerate)_0.25s_forwards]">
                  {headline}
                </span>
                {headlineAccent && (
                  <span className="block italic text-[color:var(--color-primary-300)] opacity-0 animate-[fdRise_var(--duration-enter)_var(--easing-decelerate)_0.45s_forwards]">
                    {headlineAccent}
                  </span>
                )}
              </h1>

              {/* Subhead (kept compact) */}
              {subhead && (
                <p className="mt-[var(--space-5)] max-w-xl font-[family-name:var(--font-body)] text-[length:var(--space-4)] font-[var(--font-weight-body-regular)] leading-[var(--line-height-body)] text-[color:var(--color-primary-100)] opacity-0 animate-[fdFadeIn_var(--duration-enter)_var(--easing-decelerate)_0.7s_forwards]">
                  {subhead}
                </p>
              )}

              {/* CTA row — side-by-side (the reference) */}
              <div className="mt-[var(--space-7)] flex flex-col items-stretch gap-[var(--space-3)] sm:flex-row sm:items-center sm:gap-[var(--space-4)] opacity-0 animate-[fdFadeIn_var(--duration-enter)_var(--easing-decelerate)_0.85s_forwards]">
                <a
                  href={primaryCtaHref}
                  className="group inline-flex items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-sm)] bg-[color:var(--color-primary-500)] px-[var(--space-7)] py-[var(--space-4)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-on-primary)] shadow-[var(--shadow-sm)] transition-[background-color,box-shadow,transform] duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:bg-[color:var(--color-primary-700)] hover:shadow-[var(--shadow-md)] hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
                >
                  {primaryCtaLabel}
                  <ArrowRight
                    className="h-[var(--space-3)] w-[var(--space-3)] transition-transform duration-[var(--duration-base)] ease-[var(--easing-standard)] group-hover:translate-x-[var(--space-1)]"
                    aria-hidden="true"
                  />
                </a>

                <a
                  href={secondaryCtaHref}
                  className="group inline-flex items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-sm)] border border-[color:var(--color-primary-500)] bg-transparent px-[var(--space-7)] py-[var(--space-4)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-500)] transition-[background-color,color] duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:bg-[color:rgba(233,193,118,0.10)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
                >
                  {secondaryCtaLabel}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Scroll-cue (the reference's bottom-center bounce) ──────── */}
      <a
        href={scrollCueHref}
        aria-label={scrollCueLabel}
        className="absolute inset-x-0 bottom-[var(--space-3)] z-10 mx-auto flex w-fit flex-col items-center gap-[var(--space-1)] text-[color:var(--color-on-primary)] opacity-0 animate-[fdFadeIn_var(--duration-enter)_var(--easing-decelerate)_1.1s_forwards] motion-reduce:animate-none"
      >
        <span className="font-[family-name:var(--font-body)] text-[10px] font-[var(--font-weight-body-semibold)] uppercase tracking-[0.2em] opacity-70">
          {scrollCueLabel}
        </span>
        <ChevronDown
          className="h-[var(--space-5)] w-[var(--space-5)] motion-safe:animate-[fdBob_2s_ease-in-out_infinite]"
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
        @keyframes fdBob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(6px); }
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
