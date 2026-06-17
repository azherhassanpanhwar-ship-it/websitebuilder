/**
 * LATTICE Theme #1 — Fine Dining
 * Footer component — premium multi-column layout on the dark surface,
 * with a hairline frame (the reference's signature) and a refined
 * "Follow" + "Visit" + "Maison" + "Receive" grid.
 *
 * Design Law 5 — Footer
 *   - "expanded": 4-column grid — brand+tagline / Visit / Maison / Receive
 *   - Background: always `var(--color-surface-dark)` (deep brown/black)
 *     — never the same as body. Required by Skill 2.
 *   - Hairline frame at top and bottom (the reference).
 *
 * Skill 1 — CRDT
 *   Pure presentational component. The newsletter form has ephemeral
 *   state (allowed per CLAUDE.md §3 Skill 1).
 *
 * Skill 2 — W3C Design Tokens
 *   Every visual primitive is a `var(--token-*)` reference. No hex,
 *   no px literals.
 *
 * Skill 5 — lucide-react
 *   Send for the newsletter submit button; MapPin / Phone / Mail for
 *   the visit column. Single icon system.
 */

"use client";

import * as React from "react";
import { Send, MapPin, Phone, Mail, Disc3, Film } from "lucide-react";

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
  /** Navigation columns. Defaults to 2 standard columns (Visit / Maison). */
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
      className="relative bg-[color:var(--color-surface-dark)] text-[color:var(--color-primary-100)]"
    >
      {/* ─── Hairline top frame (the reference's signature) ─────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[color:var(--color-border)] opacity-70"
      />

      <div className="mx-auto w-full max-w-[var(--container-max)] px-[var(--margin-mobile)] py-[var(--space-10)] md:px-[var(--margin-desktop)] md:py-[var(--space-10)]">
        {/* ─── Brand block — sits across the top, more theatrical ──────── */}
        <div className="grid grid-cols-1 items-end gap-[var(--space-7)] border-b border-[color:var(--color-border)] pb-[var(--space-8)] md:grid-cols-12">
          <div className="md:col-span-7">
            <a
              href="#top"
              className="inline-flex items-center gap-[var(--space-3)] rounded-[var(--radius-sm)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
              aria-label={`${brandName} — home`}
            >
              <span className="flex h-[var(--space-8)] w-[var(--space-8)] items-center justify-center rounded-[var(--radius-sm)] border border-[color:var(--color-primary-500)] font-[family-name:var(--font-display)] text-[length:var(--space-5)] font-[var(--font-weight-display)] italic leading-none text-[color:var(--color-primary-500)]">
                {brandMark}
              </span>
              <span className="font-[family-name:var(--font-display)] text-[length:var(--space-7)] font-[var(--font-weight-display)] leading-none tracking-[var(--letter-spacing-display)] text-[color:var(--color-on-primary)]">
                {brandName}
              </span>
            </a>
            <p className="mt-[var(--space-5)] max-w-md font-[family-name:var(--font-display)] text-[length:clamp(1.5rem,2.2vw,2rem)] font-[var(--font-weight-display-italic)] italic leading-[var(--line-height-subhead)] text-[color:var(--color-primary-200)]">
              {tagline}
            </p>
          </div>

          <div className="md:col-span-5">
            <p className="font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-500)]">
              Follow the room
            </p>
            <ul className="mt-[var(--space-4)] flex flex-wrap items-center gap-[var(--space-4)]">
              <li>
                <a
                  href="#"
                  className="inline-flex items-center gap-[var(--space-2)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-100)] transition-colors duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:text-[color:var(--color-primary-500)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
                >
                  <Disc3 className="h-[var(--space-3)] w-[var(--space-3)]" aria-hidden="true" />
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-flex items-center gap-[var(--space-2)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-100)] transition-colors duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:text-[color:var(--color-primary-500)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
                >
                  <Disc3 className="h-[var(--space-3)] w-[var(--space-3)]" aria-hidden="true" />
                  Spotify
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-flex items-center gap-[var(--space-2)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-100)] transition-colors duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:text-[color:var(--color-primary-500)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
                >
                  <Film className="h-[var(--space-3)] w-[var(--space-3)]" aria-hidden="true" />
                  Vimeo
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ─── Four-column link grid ──────────────────────────────────── */}
        <div className="mt-[var(--space-8)] grid grid-cols-1 gap-[var(--space-7)] md:grid-cols-2 lg:grid-cols-4">
          {/* Contact column */}
          <div>
            <h3 className="font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-500)]">
              Find us
            </h3>
            <ul className="mt-[var(--space-4)] flex flex-col gap-[var(--space-3)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] text-[color:var(--color-primary-100)]">
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

          {/* Navigation columns */}
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

          {/* Newsletter */}
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
                  className="inline-flex shrink-0 items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-sm)] bg-[color:var(--color-primary-500)] px-[var(--space-4)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-on-primary)] shadow-[var(--shadow-sm)] transition-[background-color,box-shadow] duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:bg-[color:var(--color-primary-700)] hover:shadow-[var(--shadow-md)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
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
        <div className="mt-[var(--space-9)] flex flex-col items-start gap-[var(--space-3)] border-t border-[color:var(--color-border)] pt-[var(--space-5)] sm:flex-row sm:items-center sm:justify-between">
          <p className="font-[family-name:var(--font-body)] text-[length:var(--space-3)] text-[color:var(--color-primary-200)]">
            © {copyrightYear} {brandName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-[var(--space-3)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] text-[color:var(--color-primary-200)]">
            <a
              href="#privacy"
              className="rounded-[var(--radius-xs)] underline-offset-4 transition-colors duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:text-[color:var(--color-on-primary)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
            >
              Privacy
            </a>
            <span aria-hidden="true" className="text-[color:var(--color-border)]">
              ·
            </span>
            <a
              href="#terms"
              className="rounded-[var(--radius-xs)] underline-offset-4 transition-colors duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:text-[color:var(--color-on-primary)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
            >
              Terms
            </a>
            <span aria-hidden="true" className="text-[color:var(--color-border)]">
              ·
            </span>
            <a
              href="#accessibility"
              className="rounded-[var(--radius-xs)] underline-offset-4 transition-colors duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:text-[color:var(--color-on-primary)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
            >
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FineDiningFooter;
