"use client";

/**
 * HeroBlock — base UI block for the page-level hero.
 *
 * Skill 2 — W3C Design Tokens
 *   Colors and spacing are CSS variable references. The hero's minimum
 *   height uses the spacing token scale (`--space-10` / `--space-11`).
 *   Typography is the body/display font-family tokens. The CTA button
 *   is the primary surface — `bg-primary` resolves to `var(--color-
 *   primary-500)` from the Tailwind config in apps/web/tailwind.config.ts.
 *
 * Skill 1 — CRDT
 *   Pure presentational component. Receives all content as plain props
 *   from the parent block's Y.Map. Re-renders are driven by the
 *   EditorCanvas's Y.Doc observation.
 */

import * as React from "react";
import { ArrowRight } from "lucide-react";

export interface HeroBlockProps {
  /** Display title (rendered as an <h1>). */
  title?: string;
  /** Supporting copy below the title. */
  subtitle?: string;
  /** CTA button label. Omit (or set to empty) to hide the button. */
  ctaLabel?: string;
  /** CTA button href. */
  ctaHref?: string;
  /** Optional secondary CTA (text link). */
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  /** Background image — used by `full-bleed-image` and `dark-moody` patterns. */
  imageUrl?: string;
  /** Hero pattern from HeroSettings. Drives layout choices. */
  pattern?:
    | "full-bleed-image"
    | "split-image-text"
    | "centered-text-image"
    | "gallery-grid"
    | "animated-interactive"
    | "video-background"
    | "device-mockup"
    | "dark-moody"
    | "minimal-text"
    | "illustrated";
  /** Vertical content alignment. */
  alignment?: "top" | "center" | "bottom";
}

const ALIGN_ITEMS: Record<NonNullable<HeroBlockProps["alignment"]>, string> = {
  top: "items-start text-left",
  center: "items-center text-center",
  bottom: "items-end text-left",
};

const ALIGN_JUSTIFY: Record<NonNullable<HeroBlockProps["alignment"]>, string> = {
  top: "justify-start",
  center: "justify-center",
  bottom: "justify-end",
};

export function HeroBlock(props: HeroBlockProps) {
  const {
    title = "Your story, beautifully told.",
    subtitle = "LATTICE themes ship with WCAG 2.2 AA, Lighthouse 95+, and zero hardcoded values.",
    ctaLabel = "Get started",
    ctaHref = "#",
    secondaryCtaLabel,
    secondaryCtaHref,
    imageUrl,
    pattern = "full-bleed-image",
    alignment = "bottom",
  } = props;

  const isFullBleed =
    pattern === "full-bleed-image" || pattern === "dark-moody" || pattern === "video-background";
  const isDark = pattern === "dark-moody";

  return (
    <section
      className={[
        "relative w-full overflow-hidden",
        "min-h-[var(--space-11)]", // 160px — token-driven
        isFullBleed
          ? "bg-[color:var(--color-surface-dark)] text-[color:var(--color-on-primary)]"
          : "bg-[color:var(--color-surface)] text-[color:var(--color-text)]",
      ].join(" ")}
      aria-label="Hero"
    >
      {imageUrl && isFullBleed ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
          aria-hidden="true"
        />
      ) : null}
      {/* Overlay for full-bleed patterns — token-driven (translucent surface). */}
      {imageUrl && isFullBleed ? (
        <div
          className={[
            "absolute inset-0",
            isDark
              ? "bg-[color:var(--color-surface-dark)] opacity-70"
              : "bg-[color:var(--color-surface-translucent)] opacity-40",
          ].join(" ")}
          aria-hidden="true"
        />
      ) : null}

      <div
        className={[
          "relative mx-auto flex h-full w-full max-w-[1440px] flex-col px-[var(--space-6)] py-[var(--space-9)]",
          ALIGN_JUSTIFY[alignment],
        ].join(" ")}
      >
        <div
          className={["flex max-w-3xl flex-col gap-[var(--space-4)]", ALIGN_ITEMS[alignment]].join(
            " ",
          )}
        >
          <h1
            className={[
              "font-[family-name:var(--font-display)] font-semibold tracking-tight",
              "text-[length:var(--space-7)] leading-[1.1]",
              "md:text-[length:var(--space-8)]",
            ].join(" ")}
          >
            {title}
          </h1>
          {subtitle ? (
            <p
              className={[
                "font-[family-name:var(--font-body)]",
                "text-[length:var(--space-5)] leading-[1.5]",
                isFullBleed
                  ? "text-[color:var(--color-on-primary)] opacity-90"
                  : "text-[color:var(--color-text-muted)]",
              ].join(" ")}
            >
              {subtitle}
            </p>
          ) : null}
          {ctaLabel || secondaryCtaLabel ? (
            <div
              className={[
                "mt-[var(--space-4)] flex flex-wrap items-center gap-[var(--space-4)]",
                alignment === "center" ? "justify-center" : "justify-start",
              ].join(" ")}
            >
              {ctaLabel ? (
                <a
                  href={ctaHref}
                  className={[
                    "inline-flex items-center gap-[var(--space-2)]",
                    "rounded-[var(--radius-md)]",
                    "px-[var(--space-6)] py-[var(--space-3)]",
                    "text-[length:var(--space-4)] font-semibold",
                    "bg-[color:var(--color-primary)] text-[color:var(--color-on-primary)]",
                    "shadow-[var(--shadow-md)]",
                    "transition-[background-color,transform] duration-[var(--duration-base)] ease-[ease]",
                    "hover:bg-[color:var(--color-primary-900)]",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-focus-ring)]",
                  ].join(" ")}
                >
                  {ctaLabel}
                  <ArrowRight
                    className="h-[var(--space-4)] w-[var(--space-4)]"
                    aria-hidden="true"
                  />
                </a>
              ) : null}
              {secondaryCtaLabel && secondaryCtaHref ? (
                <a
                  href={secondaryCtaHref}
                  className={[
                    "text-[length:var(--space-4)] font-medium underline-offset-4",
                    "text-[color:var(--color-primary)] hover:underline",
                  ].join(" ")}
                >
                  {secondaryCtaLabel} →
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default HeroBlock;
