"use client";

/**
 * HeaderBlock — site-level header (logo, nav, CTA).
 *
 * Skill 2 — W3C Design Tokens
 *   Every visual primitive is a CSS variable reference. The background
 *   uses `--color-surface-translucent` so the `transparent-over-hero`
 *   style lets the hero image show through (the theme generator emits a
 *   translucent surface value at runtime).
 *
 * Skill 1 — CRDT
 *   Receives all content as plain props from the block's Y.Map. Pure
 *   presentational — re-renders come from the parent EditorCanvas's
 *   Y.Doc observation.
 *
 * lucide-react (CLAUDE.md §0, Skill 5)
 *   Uses `Menu` and `X` for the mobile drawer toggle, `ChevronRight`
 *   for the nav link affordance. Single icon system — every icon in
 *   the codebase uses lucide-react.
 */

import * as React from "react";
import Link from "next/link";
import { Menu, X, ChevronRight } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
}

export interface HeaderBlockProps {
  /** Brand mark — text or absolute image URL. */
  logo?: string;
  /** When `logo` is an image URL, alt text for it. */
  logoAlt?: string;
  /** Navigation items. */
  navItems?: NavItem[];
  /** Primary CTA label (omit to hide the button). */
  ctaLabel?: string;
  ctaHref?: string;
  /** Visual style — drives whether the header is translucent over a hero. */
  style?: "transparent-over-hero" | "solid-sticky" | "centered-logo" | "split-nav" | "minimal-bar";
}

const STYLE_CLASSES: Record<NonNullable<HeaderBlockProps["style"]>, string> = {
  "transparent-over-hero":
    "bg-[color:var(--color-surface-translucent)] backdrop-blur-md text-[color:var(--color-text)]",
  "solid-sticky":
    "bg-[color:var(--color-surface)] text-[color:var(--color-text)] border-b border-[color:var(--color-border)]",
  "centered-logo": "bg-[color:var(--color-surface)] text-[color:var(--color-text)]",
  "split-nav": "bg-[color:var(--color-surface)] text-[color:var(--color-text)]",
  "minimal-bar": "bg-[color:var(--color-surface-alt)] text-[color:var(--color-text)]",
};

export function HeaderBlock(props: HeaderBlockProps) {
  const {
    logo = "LATTICE",
    logoAlt = "LATTICE",
    navItems = [],
    ctaLabel,
    ctaHref = "#",
    style = "solid-sticky",
  } = props;

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const isImageLogo = logo.startsWith("http") || logo.startsWith("/");

  return (
    <header
      className={["sticky top-0 z-50 w-full", "h-[var(--space-8)]", STYLE_CLASSES[style]].join(" ")}
    >
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between gap-[var(--space-6)] px-[var(--space-6)]">
        {/* Logo */}
        <Link
          href="/"
          aria-label={logoAlt}
          className="flex items-center gap-[var(--space-2)] font-[family-name:var(--font-display)] text-[length:var(--space-5)] font-bold tracking-tight"
        >
          {isImageLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt={logoAlt} className="h-[var(--space-5)] w-auto" />
          ) : (
            <span>{logo}</span>
          )}
        </Link>

        {/* Desktop nav */}
        {navItems.length > 0 ? (
          <nav
            className="hidden flex-1 items-center justify-center gap-[var(--space-6)] md:flex"
            aria-label="Primary"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group inline-flex items-center gap-[var(--space-1)] text-[length:var(--space-4)] font-medium hover:text-[color:var(--color-primary)]"
              >
                {item.label}
                <ChevronRight
                  className="h-[var(--space-3)] w-[var(--space-3)] opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
              </a>
            ))}
          </nav>
        ) : (
          <div className="hidden flex-1 md:block" aria-hidden="true" />
        )}

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-[var(--space-3)]">
          {ctaLabel ? (
            <a
              href={ctaHref}
              className={[
                "hidden md:inline-flex items-center",
                "rounded-[var(--radius-md)]",
                "px-[var(--space-5)] py-[var(--space-2)]",
                "text-[length:var(--space-4)] font-semibold",
                "bg-[color:var(--color-primary)] text-[color:var(--color-on-primary)]",
                "shadow-[var(--shadow-sm)]",
                "hover:bg-[color:var(--color-primary-900)]",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-focus-ring)]",
              ].join(" ")}
            >
              {ctaLabel}
            </a>
          ) : null}
          <button
            type="button"
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            aria-expanded={drawerOpen}
            className="inline-flex h-[var(--space-9)] w-[var(--space-9)] items-center justify-center rounded-[var(--radius-md)] md:hidden"
            onClick={() => setDrawerOpen((v) => !v)}
          >
            {drawerOpen ? (
              <X className="h-[var(--space-5)] w-[var(--space-5)]" />
            ) : (
              <Menu className="h-[var(--space-5)] w-[var(--space-5)]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {drawerOpen ? (
        <div
          className="absolute inset-x-0 top-full origin-top animate-[fadeIn_var(--duration-base)_ease-[ease]] border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-md)] md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
        >
          <nav
            className="flex flex-col gap-[var(--space-2)] p-[var(--space-4)]"
            aria-label="Mobile primary"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setDrawerOpen(false)}
                className="rounded-[var(--radius-md)] px-[var(--space-3)] py-[var(--space-3)] text-[length:var(--space-4)] font-medium hover:bg-[color:var(--color-surface-alt)]"
              >
                {item.label}
              </a>
            ))}
            {ctaLabel ? (
              <a
                href={ctaHref}
                onClick={() => setDrawerOpen(false)}
                className="mt-[var(--space-2)] rounded-[var(--radius-md)] bg-[color:var(--color-primary)] px-[var(--space-3)] py-[var(--space-3)] text-center text-[length:var(--space-4)] font-semibold text-[color:var(--color-on-primary)]"
              >
                {ctaLabel}
              </a>
            ) : null}
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export default HeaderBlock;
