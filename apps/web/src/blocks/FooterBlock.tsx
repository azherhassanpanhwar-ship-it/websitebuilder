"use client";

/**
 * FooterBlock — site-level footer with columns, newsletter, social.
 *
 * Skill 2 — W3C Design Tokens
 *   Uses `--color-surface-dark` as the footer background (the
 *   marketplace convention for "compact" / "expanded" / "multi-column"
 *   styles). All spacing, colors, radii are CSS variable references.
 *
 * Skill 1 — CRDT
 *   Receives all content as plain props from the block's Y.Map.
 *
 * lucide-react (CLAUDE.md §0, Skill 5)
 *   `Send` for the newsletter submit, `Globe` for the generic social
 *   link affordance. Single icon system — every icon in the codebase
 *   uses lucide-react. (Brand-specific social marks can be inlined
 *   as SVG paths in a follow-up task.)
 */

import * as React from "react";
import { Send, Globe } from "lucide-react";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterBlockProps {
  /** Copyright / brand line at the bottom. */
  copyright?: string;
  /** Top-level column groups. */
  columns?: FooterColumn[];
  /** Show the newsletter capture form. */
  newsletter?: boolean;
  newsletterLabel?: string;
  newsletterPlaceholder?: string;
  newsletterCta?: string;
  /** Social link overrides (defaults to the brand's standard set). */
  socials?: { platform: "github" | "twitter" | "linkedin"; href: string }[];
  /** Visual style from FooterSettings. */
  style?: "compact" | "expanded" | "multi-column" | "centered-minimal";
}

const STYLE_CLASSES: Record<NonNullable<FooterBlockProps["style"]>, string> = {
  compact: "py-[var(--space-6)]",
  expanded: "py-[var(--space-8)]",
  "multi-column": "py-[var(--space-9)]",
  "centered-minimal": "py-[var(--space-7)]",
};

const DEFAULT_SOCIAL_ICONS = {
  github: Globe,
  twitter: Globe,
  linkedin: Globe,
} as const;

export function FooterBlock(props: FooterBlockProps) {
  const {
    copyright = `© ${new Date().getFullYear()} LATTICE. All rights reserved.`,
    columns = [],
    newsletter = false,
    newsletterLabel = "Stay in the loop",
    newsletterPlaceholder = "you@example.com",
    newsletterCta = "Subscribe",
    socials,
    style = "expanded",
  } = props;

  const isMinimal = style === "centered-minimal";

  return (
    <footer
      className={[
        "w-full",
        "bg-[color:var(--color-surface-dark)] text-[color:var(--color-text-muted)]",
        STYLE_CLASSES[style],
      ].join(" ")}
    >
      <div className="mx-auto w-full max-w-[1440px] px-[var(--space-6)]">
        {isMinimal ? (
          <CenteredFooter
            copyright={copyright}
            socials={socials}
            socialIconMap={DEFAULT_SOCIAL_ICONS}
          />
        ) : (
          <div className="grid gap-[var(--space-8)] md:grid-cols-[1.5fr_repeat(auto-fit,minmax(160px,1fr))]">
            <div className="flex flex-col gap-[var(--space-4)]">
              {newsletter ? (
                <NewsletterForm
                  label={newsletterLabel}
                  placeholder={newsletterPlaceholder}
                  cta={newsletterCta}
                />
              ) : null}
              <SocialRow socials={socials} iconMap={DEFAULT_SOCIAL_ICONS} />
            </div>
            {columns.map((col) => (
              <FooterColumnView key={col.title} column={col} />
            ))}
          </div>
        )}
        <div
          className={[
            "mt-[var(--space-8)] flex flex-col items-start gap-[var(--space-2)] border-t border-[color:var(--color-border)] pt-[var(--space-6)]",
            "text-[length:var(--space-3)]",
            isMinimal ? "items-center" : "",
          ].join(" ")}
        >
          <span>{copyright}</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Sub-components (internal) ─────────────────────────────────────────────

function CenteredFooter({
  copyright,
  socials,
  socialIconMap,
}: {
  copyright: string;
  socials?: FooterBlockProps["socials"];
  socialIconMap: typeof DEFAULT_SOCIAL_ICONS;
}) {
  return (
    <div className="flex flex-col items-center gap-[var(--space-4)] text-center">
      <SocialRow socials={socials} iconMap={socialIconMap} />
      <span className="text-[length:var(--space-3)]">{copyright}</span>
    </div>
  );
}

function NewsletterForm({
  label,
  placeholder,
  cta,
}: {
  label: string;
  placeholder: string;
  cta: string;
}) {
  return (
    <form className="flex flex-col gap-[var(--space-2)]" onSubmit={(e) => e.preventDefault()}>
      <label
        htmlFor="footer-newsletter"
        className="text-[length:var(--space-4)] font-semibold text-[color:var(--color-on-primary)]"
      >
        {label}
      </label>
      <div className="flex w-full max-w-md overflow-hidden rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
        <input
          id="footer-newsletter"
          type="email"
          required
          placeholder={placeholder}
          className="flex-1 bg-transparent px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--space-4)] text-[color:var(--color-text)] placeholder:text-[color:var(--color-text-muted)] focus:outline-none"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-[var(--space-2)] bg-[color:var(--color-primary)] px-[var(--space-5)] text-[length:var(--space-4)] font-semibold text-[color:var(--color-on-primary)] hover:bg-[color:var(--color-primary-900)]"
        >
          {cta}
          <Send className="h-[var(--space-4)] w-[var(--space-4)]" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}

function SocialRow({
  socials,
  iconMap,
}: {
  socials?: FooterBlockProps["socials"];
  iconMap: typeof DEFAULT_SOCIAL_ICONS;
}) {
  const items =
    socials && socials.length > 0
      ? socials
      : [
          { platform: "github" as const, href: "https://github.com" },
          { platform: "twitter" as const, href: "https://twitter.com" },
          { platform: "linkedin" as const, href: "https://linkedin.com" },
        ];
  return (
    <div className="flex items-center gap-[var(--space-3)]">
      {items.map((s) => {
        const Icon = iconMap[s.platform];
        return (
          <a
            key={s.platform}
            href={s.href}
            aria-label={s.platform}
            rel="noreferrer noopener"
            target="_blank"
            className="inline-flex h-[var(--space-9)] w-[var(--space-9)] items-center justify-center rounded-[var(--radius-md)] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface)] hover:text-[color:var(--color-on-primary)]"
          >
            <Icon className="h-[var(--space-5)] w-[var(--space-5)]" aria-hidden="true" />
          </a>
        );
      })}
    </div>
  );
}

function FooterColumnView({ column }: { column: FooterColumn }) {
  return (
    <div className="flex flex-col gap-[var(--space-3)]">
      <h3 className="text-[length:var(--space-3)] font-semibold uppercase tracking-wider text-[color:var(--color-on-primary)]">
        {column.title}
      </h3>
      <ul className="flex flex-col gap-[var(--space-2)]">
        {column.links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-[length:var(--space-4)] text-[color:var(--color-text-muted)] transition-colors hover:text-[color:var(--color-on-primary)]"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FooterBlock;
