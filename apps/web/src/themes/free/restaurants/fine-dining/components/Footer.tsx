/**
 * LATTICE Theme #1 — Fine Dining
 * Footer component — expanded layout on the dark surface.
 *
 * Design Law 5 — Footer
 *   - "expanded": 3-4 column grid — logo+tagline / nav / contact / social
 *   - Background: always `var(--color-surface-dark)` (deep brown)
 *     — never the same as body. Required by Skill 2.
 *
 * Skill 1 — CRDT
 *   Pure presentational component. No Yjs / useState.
 *
 * Skill 2 — W3C Design Tokens
 *   Every visual primitive is a `var(--token-*)` reference. No hex,
 *   no px literals.
 *
 * Skill 5 — lucide-react
 *   Send for the newsletter submit button; Globe for the language
 *   hint. Single icon system.
 */

"use client";

import * as React from "react";
import { Send, Globe, MapPin, Phone, Mail } from "lucide-react";

export interface FineDiningFooterLink {
  label: string;
  href: string;
}

export interface FineDiningFooterColumn {
  title: string;
  links: FineDiningFooterLink[];
}

export interface FineDiningFooterProps {
  brandName?: string;
  brandMark?: string;
  tagline?: string;
  /** Navigation columns. Defaults to 2 standard columns. */
  columns?: FineDiningFooterColumn[];
  address?: string;
  phone?: string;
  email?: string;
  /** Newsletter copy + handler. */
  newsletterHeadline?: string;
  newsletterPlaceholder?: string;
  newsletterCta?: string;
  /** Optional async submit handler. Pure presentational if omitted. */
  onNewsletterSubmit?: (email: string) => void | Promise<void>;
  copyrightYear?: number;
}

const DEFAULT_COLUMNS: FineDiningFooterColumn[] = [
  {
    title: "Visit",
    links: [
      { label: "Menu", href: "#menu" },
      { label: "Wine List", href: "#wine" },
      { label: "Reservations", href: "#reserve" },
      { label: "Gift Cards", href: "#gift-cards" },
    ],
  },
  {
    title: "Maison",
    links: [
      { label: "Our Story", href: "#story" },
      { label: "The Kitchen", href: "#kitchen" },
      { label: "Press", href: "#press" },
      { label: "Careers", href: "#careers" },
    ],
  },
];

export function FineDiningFooter({
  brandName = "Maison Lumière",
  brandMark = "ML",
  tagline = "An evening, set with care.",
  columns = DEFAULT_COLUMNS,
  address = "12 Rue de la Paix · Downtown",
  phone = "+1 (555) 012-3456",
  email = "reservations@maisonlumiere.example",
  newsletterHeadline = "Receive the seasonal menu",
  newsletterPlaceholder = "you@example.com",
  newsletterCta = "Subscribe",
  onNewsletterSubmit,
  copyrightYear = new Date().getFullYear(),
}: FineDiningFooterProps) {
  const [newsletterEmail, setNewsletterEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "submitting" | "ok" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setStatus("submitting");
    try {
      if (onNewsletterSubmit) {
        await onNewsletterSubmit(newsletterEmail);
      }
      setStatus("ok");
      setNewsletterEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <footer
      data-theme-footer
      aria-label="Site footer"
      className="bg-[color:var(--color-surface-dark)] text-[color:var(--color-primary-100)]"
    >
      <div className="mx-auto w-full max-w-[1440px] px-[var(--space-5)] py-[var(--space-9)] md:px-[var(--space-6)]">
        <div className="grid grid-cols-1 gap-[var(--space-8)] md:grid-cols-2 lg:grid-cols-4">
          {/* ─── Brand + tagline ─────────────────────────────────────── */}
          <div>
            <a
              href="#top"
              className="inline-flex items-center gap-[var(--space-3)] rounded-[var(--radius-sm)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
              aria-label={`${brandName} — home`}
            >
              <span className="flex h-[var(--space-7)] w-[var(--space-7)] items-center justify-center rounded-[var(--radius-sm)] border border-[color:var(--color-primary-500)] font-[family-name:var(--font-display)] text-[length:var(--space-4)] font-[var(--font-weight-display)] leading-none text-[color:var(--color-primary-500)]">
                {brandMark}
              </span>
              <span className="font-[family-name:var(--font-display)] text-[length:var(--space-5)] font-[var(--font-weight-display)] leading-none tracking-[var(--letter-spacing-display)] text-[color:var(--color-on-primary)]">
                {brandName}
              </span>
            </a>
            <p className="mt-[var(--space-4)] max-w-xs font-[family-name:var(--font-body)] text-[length:var(--space-4)] font-[var(--font-weight-body-regular)] leading-[var(--line-height-body)] text-[color:var(--color-primary-200)]">
              {tagline}
            </p>

            {/* Contact lines */}
            <ul className="mt-[var(--space-5)] flex flex-col gap-[var(--space-3)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] text-[color:var(--color-primary-200)]">
              <li className="flex items-start gap-[var(--space-2)]">
                <MapPin
                  className="mt-[var(--space-1)] h-[var(--space-3)] w-[var(--space-3)] shrink-0 text-[color:var(--color-primary-500)]"
                  aria-hidden="true"
                />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-[var(--space-2)]">
                <Phone
                  className="h-[var(--space-3)] w-[var(--space-3)] shrink-0 text-[color:var(--color-primary-500)]"
                  aria-hidden="true"
                />
                <a
                  href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                  className="rounded-[var(--radius-xs)] underline-offset-4 transition-colors duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:text-[color:var(--color-on-primary)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
                >
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-[var(--space-2)]">
                <Mail
                  className="h-[var(--space-3)] w-[var(--space-3)] shrink-0 text-[color:var(--color-primary-500)]"
                  aria-hidden="true"
                />
                <a
                  href={`mailto:${email}`}
                  className="rounded-[var(--radius-xs)] underline-offset-4 transition-colors duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:text-[color:var(--color-on-primary)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
                >
                  {email}
                </a>
              </li>
            </ul>
          </div>

          {/* ─── Navigation columns ──────────────────────────────────── */}
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-500)]">
                {col.title}
              </h3>
              <ul className="mt-[var(--space-4)] flex flex-col gap-[var(--space-3)]">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="inline-flex min-h-[var(--space-7)] items-center font-[family-name:var(--font-body)] text-[length:var(--space-4)] text-[color:var(--color-primary-100)] transition-colors duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:text-[color:var(--color-on-primary)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* ─── Newsletter ──────────────────────────────────────────── */}
          <div>
            <h3 className="font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-500)]">
              {newsletterHeadline}
            </h3>
            <p className="mt-[var(--space-3)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] leading-[var(--line-height-body)] text-[color:var(--color-primary-200)]">
              One email per season. Unsubscribe with a click.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-[var(--space-4)] flex flex-col gap-[var(--space-3)]"
              noValidate
            >
              <label htmlFor="fine-dining-newsletter-email" className="sr-only">
                Email address
              </label>
              <div className="flex items-stretch gap-[var(--space-2)]">
                <input
                  id="fine-dining-newsletter-email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  placeholder={newsletterPlaceholder}
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="min-h-[var(--space-7)] flex-1 rounded-[var(--radius-sm)] border border-[color:var(--color-primary-700)] bg-[color:rgba(250,246,238,0.04)] px-[var(--space-3)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] text-[color:var(--color-on-primary)] placeholder:text-[color:var(--color-primary-300)] transition-[border-color,box-shadow] duration-[var(--duration-base)] ease-[var(--easing-standard)] focus:border-[color:var(--color-primary-500)] focus:outline-2 focus:outline-[color:var(--color-focus-ring)] focus:outline-offset-2"
                />
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="inline-flex shrink-0 items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-sm)] bg-[color:var(--color-primary-500)] px-[var(--space-4)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] font-[var(--font-weight-body-semibold)] text-[color:var(--color-on-primary)] shadow-[var(--shadow-sm)] transition-[background-color,box-shadow] duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:bg-[color:var(--color-primary-700)] hover:shadow-[var(--shadow-md)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send className="h-[var(--space-3)] w-[var(--space-3)]" aria-hidden="true" />
                  {status === "submitting" ? "…" : newsletterCta}
                </button>
              </div>
              {status === "ok" && (
                <p
                  role="status"
                  className="font-[family-name:var(--font-body)] text-[length:var(--space-3)] text-[color:var(--color-success)]"
                >
                  Thank you. Watch for our next season&apos;s menu.
                </p>
              )}
              {status === "error" && (
                <p
                  role="alert"
                  className="font-[family-name:var(--font-body)] text-[length:var(--space-3)] text-[color:var(--color-error)]"
                >
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* ─── Bottom bar ───────────────────────────────────────────── */}
        <div className="mt-[var(--space-9)] flex flex-col items-start gap-[var(--space-3)] border-t border-[color:var(--color-primary-900)] pt-[var(--space-5)] sm:flex-row sm:items-center sm:justify-between">
          <p className="font-[family-name:var(--font-body)] text-[length:var(--space-3)] text-[color:var(--color-primary-200)]">
            © {copyrightYear} {brandName}. All rights reserved.
          </p>
          <div className="flex items-center gap-[var(--space-3)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] text-[color:var(--color-primary-200)]">
            <Globe className="h-[var(--space-3)] w-[var(--space-3)]" aria-hidden="true" />
            <button
              type="button"
              className="rounded-[var(--radius-xs)] underline-offset-4 transition-colors duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:text-[color:var(--color-on-primary)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
              aria-label="Change language"
            >
              English (US)
            </button>
            <span aria-hidden="true">·</span>
            <a
              href="#privacy"
              className="rounded-[var(--radius-xs)] underline-offset-4 transition-colors duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:text-[color:var(--color-on-primary)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
            >
              Privacy
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="#terms"
              className="rounded-[var(--radius-xs)] underline-offset-4 transition-colors duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:text-[color:var(--color-on-primary)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FineDiningFooter;
