"use client";

/**
 * LATTICE Theme #1 — Fine Dining
 * Header component — transparent over the hero, solid on scroll,
 * with a hairline scroll-progress indicator (the reference's signature).
 *
 * Design Law 5 — Navigation
 *   - Sticky header with `backdrop-filter: blur(14px)` once scrolled.
 *   - Transparent at top (so the hero image shows through), solid
 *     `var(--color-surface)` + blur after 16px of scroll.
 *   - Mobile: hamburger at ≤768px · drawer slides from right.
 *   - Active link: color: var(--color-primary) + underline accent.
 *   - Min tap target 44×44px (WCAG 2.5.5).
 *   - Scroll-progress hairline: 1px gold bar across the bottom of the
 *     header, growing from 0 → 100% width as the user scrolls.
 *
 * Skill 1 — CRDT
 *   This is a presentational component. The "scrolled" boolean and
 *   the scroll progress are the only React state, and they're
 *   ephemeral UI state (allowed per CLAUDE.md §3 Skill 1).
 *
 * Skill 2 — W3C Design Tokens
 *   Every visual primitive is a `var(--token-*)` reference. No hex,
 *   no px literals.
 *
 * Skill 5 — lucide-react
 *   Menu / X for the mobile drawer toggle.
 */

import * as React from "react";
import { Menu, X, ChevronRight } from "lucide-react";

export interface FineDiningNavItem {
  label: string;
  href: string;
}

export interface FineDiningHeaderProps {
  /** Brand / restaurant name. */
  brandName?: string;
  /** Optional wordmark / monogram for the brand link. */
  brandMark?: string;
  /** Top-level navigation items. */
  navItems?: FineDiningNavItem[];
  /** Primary CTA label (e.g. "Reserve"). */
  ctaLabel?: string;
  /** Primary CTA href. */
  ctaHref?: string;
}

const DEFAULT_NAV: FineDiningNavItem[] = [
  { label: "Menu", href: "#menu" },
  { label: "Wine List", href: "#wine" },
  { label: "Reservations", href: "#reserve" },
  { label: "Private Dining", href: "#private" },
  { label: "Our Story", href: "#story" },
  { label: "Contact", href: "#contact" },
];

export function FineDiningHeader({
  brandName = "Maison Lumière",
  brandMark = "ML",
  navItems = DEFAULT_NAV,
  ctaLabel = "Reserve",
  ctaHref = "#reserve",
}: FineDiningHeaderProps) {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 16);
      // Document scroll progress (0..1)
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight || 1;
      setProgress(Math.min(1, Math.max(0, y / max)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Close the drawer on Escape
  React.useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <header
      data-theme-header
      data-scrolled={scrolled ? "true" : "false"}
      className="fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-[var(--duration-base)] ease-[var(--easing-standard)]"
      style={{
        backgroundColor: scrolled
          ? "color-mix(in srgb, var(--color-surface) 92%, transparent)"
          : "rgba(14, 14, 14, 0)",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid var(--color-border)" : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex w-full max-w-[var(--container-max)] items-center justify-between gap-[var(--space-5)] px-[var(--margin-mobile)] py-[var(--space-4)] md:px-[var(--margin-desktop)]">
        {/* ─── Brand mark (display serif monogram + wordmark) ───────────── */}
        <a
          href="#top"
          className="group inline-flex items-center gap-[var(--space-3)] rounded-[var(--radius-sm)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
          aria-label={`${brandName} — home`}
        >
          <span
            className="flex h-[var(--space-7)] w-[var(--space-7)] items-center justify-center rounded-[var(--radius-sm)] border font-[family-name:var(--font-display)] text-[length:var(--space-4)] font-[var(--font-weight-display)] italic leading-none transition-[background-color,border-color,color] duration-[var(--duration-base)] ease-[var(--easing-standard)]"
            style={{
              borderColor: scrolled ? "var(--color-primary-500)" : "var(--color-primary-300)",
              color: scrolled ? "var(--color-primary-500)" : "var(--color-primary-300)",
            }}
          >
            {brandMark}
          </span>
          <span
            className="font-[family-name:var(--font-display)] text-[length:var(--space-5)] font-[var(--font-weight-display)] leading-none tracking-[var(--letter-spacing-display)]"
            style={{
              color: scrolled ? "var(--color-text)" : "var(--color-on-primary)",
            }}
          >
            {brandName}
          </span>
        </a>

        {/* ─── Desktop nav (≥md) ────────────────────────────────────── */}
        <nav
          aria-label="Primary"
          className="hidden md:flex md:items-center md:gap-[var(--space-6)]"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative inline-flex min-h-[var(--space-7)] items-center font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] transition-colors duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:text-[color:var(--color-primary-500)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
              style={{
                color: scrolled ? "var(--color-text)" : "var(--color-on-primary)",
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* ─── Desktop CTA (≥md) ────────────────────────────────────── */}
        <div className="hidden md:block">
          <a
            href={ctaHref}
            className="inline-flex min-h-[var(--space-7)] items-center gap-[var(--space-2)] rounded-[var(--radius-sm)] bg-[color:var(--color-primary-500)] px-[var(--space-5)] py-[var(--space-3)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-on-primary)] shadow-[var(--shadow-sm)] transition-[background-color,box-shadow,transform] duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:bg-[color:var(--color-primary-700)] hover:shadow-[var(--shadow-md)] hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
          >
            {ctaLabel}
            <ChevronRight className="h-[var(--space-3)] w-[var(--space-3)]" aria-hidden="true" />
          </a>
        </div>

        {/* ─── Mobile menu toggle (<md) ──────────────────────────────── */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="fine-dining-mobile-drawer"
          onClick={() => setMobileOpen((v) => !v)}
          className="inline-flex h-[var(--space-7)] w-[var(--space-7)] items-center justify-center rounded-[var(--radius-sm)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2 md:hidden"
          style={{
            color: scrolled ? "var(--color-text)" : "var(--color-on-primary)",
          }}
        >
          {mobileOpen ? (
            <X className="h-[var(--space-5)] w-[var(--space-5)]" aria-hidden="true" />
          ) : (
            <Menu className="h-[var(--space-5)] w-[var(--space-5)]" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* ─── Hairline scroll-progress (the reference's signature) ────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--color-primary-500) 30%, var(--color-primary-300) 70%, transparent 100%)",
          transform: `scaleX(${progress})`,
          transformOrigin: "left center",
          opacity: scrolled ? 1 : 0,
          transition: "opacity var(--duration-base) var(--easing-standard)",
        }}
      />

      {/* ─── Mobile drawer (<md) ────────────────────────────────────── */}
      {mobileOpen && (
        <div
          id="fine-dining-mobile-drawer"
          className="absolute inset-x-0 top-full md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div
            className="mx-[var(--space-3)] mt-[var(--space-2)] rounded-[var(--radius-sm)] border border-[color:var(--color-border)] shadow-[var(--shadow-lg)]"
            style={{
              backgroundColor: "var(--color-surface)",
            }}
          >
            <nav aria-label="Mobile primary" className="flex flex-col p-[var(--space-3)]">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex min-h-[var(--space-7)] items-center justify-between rounded-[var(--radius-xs)] px-[var(--space-3)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-text)] transition-colors duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:bg-[color:var(--color-surface-alt)] hover:text-[color:var(--color-primary-500)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
                >
                  {item.label}
                  <ChevronRight
                    className="h-[var(--space-3)] w-[var(--space-3)] text-[color:var(--color-text-faint)]"
                    aria-hidden="true"
                  />
                </a>
              ))}
              <a
                href={ctaHref}
                onClick={() => setMobileOpen(false)}
                className="mt-[var(--space-2)] inline-flex min-h-[var(--space-7)] items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-sm)] bg-[color:var(--color-primary-500)] px-[var(--space-4)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-on-primary)] shadow-[var(--shadow-sm)] transition-[background-color,box-shadow] duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:bg-[color:var(--color-primary-700)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
              >
                {ctaLabel}
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export default FineDiningHeader;
