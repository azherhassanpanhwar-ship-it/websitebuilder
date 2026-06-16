/**
 * LATTICE Theme #1 — Fine Dining
 * Contact page — contact details + a map placeholder + hours.
 *
 * The "map" is a static SVG placeholder composed of token-driven colors
 * (per Design Law 2: zero hardcoded values in components). The host
 * application can replace it with an embed of Google Maps, Mapbox, or
 * OpenStreetMap when wiring the theme to a real location.
 */

import * as React from "react";
import { MapPin, Phone, Mail, Clock, CarFront, Train } from "lucide-react";

export function FineDiningContactPage() {
  return (
    <>
      {/* ─── Page header ─────────────────────────────────────── */}
      <section
        aria-labelledby="contact-heading"
        className="bg-[color:var(--color-surface)] py-[var(--space-10)] md:py-[var(--space-11)]"
      >
        <div className="mx-auto w-full max-w-[1440px] px-[var(--space-5)] md:px-[var(--space-6)]">
          <p className="font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-500)]">
            Contact
          </p>
          <h1
            id="contact-heading"
            className="mt-[var(--space-3)] max-w-3xl font-[family-name:var(--font-display)] text-[length:clamp(2.5rem,5vw,4.5rem)] font-[var(--font-weight-display)] leading-[var(--line-height-display)] tracking-[var(--letter-spacing-display)] text-[color:var(--color-text)]"
          >
            Find us downtown.
          </h1>
          <p className="mt-[var(--space-5)] max-w-2xl font-[family-name:var(--font-body)] text-[length:var(--space-5)] leading-[var(--line-height-body)] text-[color:var(--color-text-muted)]">
            We are two blocks west of Central Station, in the block between Bleecker and Carmine.
            The dining-room door is on Carmine.
          </p>
        </div>
      </section>

      {/* ─── Map + sidebar ──────────────────────────────────── */}
      <section
        aria-label="Contact details"
        className="bg-[color:var(--color-surface-alt)] py-[var(--space-10)]"
      >
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-[var(--space-9)] px-[var(--space-5)] md:grid-cols-12 md:px-[var(--space-6)]">
          {/* Map placeholder */}
          <div className="md:col-span-7">
            <h2 className="font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-500)]">
              The neighbourhood
            </h2>
            <div
              role="img"
              aria-label="Map of the downtown block. The restaurant is at 12 Rue de la Paix, between Bleecker and Carmine."
              className="mt-[var(--space-4)] aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] shadow-[var(--shadow-sm)]"
            >
              <svg
                viewBox="0 0 400 300"
                className="h-full w-full"
                role="presentation"
                aria-hidden="true"
              >
                {/* Block grid */}
                <rect x="0" y="0" width="400" height="300" fill="var(--color-surface)" />
                <g stroke="var(--color-border)" stroke-width="1">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <line key={`v${i}`} x1={(i + 1) * 40} y1="0" x2={(i + 1) * 40} y2="300" />
                  ))}
                  {Array.from({ length: 7 }).map((_, i) => (
                    <line key={`h${i}`} x1="0" y1={(i + 1) * 40} x2="400" y2={(i + 1) * 40} />
                  ))}
                </g>

                {/* Park */}
                <rect x="20" y="20" width="120" height="80" fill="var(--color-primary-100)" />
                <text
                  x="80"
                  y="65"
                  text-anchor="middle"
                  fill="var(--color-text-muted)"
                  font-family="serif"
                  font-size="12"
                  font-style="italic"
                >
                  Park
                </text>

                {/* Major street */}
                <rect x="160" y="0" width="80" height="300" fill="var(--color-surface-alt)" />
                <text
                  x="200"
                  y="155"
                  text-anchor="middle"
                  fill="var(--color-text-muted)"
                  font-family="sans-serif"
                  font-size="10"
                  font-weight="600"
                  letter-spacing="2"
                >
                  BLEECKER
                </text>

                <rect x="0" y="140" width="400" height="40" fill="var(--color-surface-alt)" />
                <text
                  x="200"
                  y="165"
                  text-anchor="middle"
                  fill="var(--color-text-muted)"
                  font-family="sans-serif"
                  font-size="10"
                  font-weight="600"
                  letter-spacing="2"
                >
                  RUE DE LA PAIX
                </text>

                <rect x="280" y="0" width="60" height="300" fill="var(--color-surface-alt)" />
                <text
                  x="310"
                  y="155"
                  text-anchor="middle"
                  fill="var(--color-text-muted)"
                  font-family="sans-serif"
                  font-size="10"
                  font-weight="600"
                  letter-spacing="2"
                >
                  CARMINE
                </text>

                {/* Restaurant pin */}
                <circle cx="200" cy="200" r="14" fill="var(--color-primary-500)" />
                <circle cx="200" cy="200" r="6" fill="var(--color-on-primary)" />
                <text
                  x="200"
                  y="232"
                  text-anchor="middle"
                  fill="var(--color-text)"
                  font-family="serif"
                  font-size="13"
                  font-weight="600"
                >
                  Maison Lumière
                </text>
                <text
                  x="200"
                  y="248"
                  text-anchor="middle"
                  fill="var(--color-text-muted)"
                  font-family="sans-serif"
                  font-size="10"
                >
                  12 Rue de la Paix
                </text>

                {/* Station */}
                <rect x="20" y="240" width="60" height="40" fill="var(--color-primary-100)" />
                <text
                  x="50"
                  y="265"
                  text-anchor="middle"
                  fill="var(--color-text-muted)"
                  font-family="sans-serif"
                  font-size="10"
                  font-weight="600"
                >
                  STATION
                </text>
              </svg>
            </div>
            <p className="mt-[var(--space-3)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] italic text-[color:var(--color-text-muted)]">
              Static placeholder. Replace with an embed of Google Maps, Mapbox, or OpenStreetMap
              when wiring the theme to a real location.
            </p>
          </div>

          <aside className="md:col-span-5 flex flex-col gap-[var(--space-5)]">
            {/* Address */}
            <div className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-[var(--space-6)] shadow-[var(--shadow-sm)]">
              <h3 className="inline-flex items-center gap-[var(--space-2)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-500)]">
                <MapPin className="h-[var(--space-3)] w-[var(--space-3)]" aria-hidden="true" />
                Address
              </h3>
              <address className="mt-[var(--space-3)] not-italic font-[family-name:var(--font-body)] text-[length:var(--space-4)] leading-[var(--line-height-body)] text-[color:var(--color-text)]">
                Maison Lumière
                <br />
                12 Rue de la Paix
                <br />
                Downtown · NY 10014
              </address>
            </div>

            {/* Hours */}
            <div className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-[var(--space-6)] shadow-[var(--shadow-sm)]">
              <h3 className="inline-flex items-center gap-[var(--space-2)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-500)]">
                <Clock className="h-[var(--space-3)] w-[var(--space-3)]" aria-hidden="true" />
                Service
              </h3>
              <dl className="mt-[var(--space-4)] flex flex-col gap-[var(--space-2)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] text-[color:var(--color-text)]">
                <div className="flex items-baseline justify-between gap-[var(--space-4)]">
                  <dt>Tuesday – Thursday</dt>
                  <dd className="text-[color:var(--color-text-muted)]">5:30 – 9:30 PM</dd>
                </div>
                <div className="flex items-baseline justify-between gap-[var(--space-4)]">
                  <dt>Friday – Saturday</dt>
                  <dd className="text-[color:var(--color-text-muted)]">5:30 – 10:30 PM</dd>
                </div>
                <div className="flex items-baseline justify-between gap-[var(--space-4)]">
                  <dt>Sunday – Monday</dt>
                  <dd className="text-[color:var(--color-text-muted)]">Closed</dd>
                </div>
              </dl>
            </div>

            {/* Direct lines */}
            <div className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-[var(--space-6)] shadow-[var(--shadow-sm)]">
              <h3 className="font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-500)]">
                Direct lines
              </h3>
              <ul className="mt-[var(--space-4)] flex flex-col gap-[var(--space-3)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] text-[color:var(--color-text)]">
                <li className="flex items-center gap-[var(--space-3)]">
                  <Phone
                    className="h-[var(--space-3)] w-[var(--space-3)] shrink-0 text-[color:var(--color-primary-500)]"
                    aria-hidden="true"
                  />
                  <a
                    href="tel:+15550123456"
                    className="rounded-[var(--radius-xs)] underline-offset-4 transition-colors duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:text-[color:var(--color-primary-700)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
                  >
                    +1 (555) 012-3456
                  </a>
                </li>
                <li className="flex items-center gap-[var(--space-3)]">
                  <Mail
                    className="h-[var(--space-3)] w-[var(--space-3)] shrink-0 text-[color:var(--color-primary-500)]"
                    aria-hidden="true"
                  />
                  <a
                    href="mailto:hello@maisonlumiere.example"
                    className="rounded-[var(--radius-xs)] underline-offset-4 transition-colors duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:text-[color:var(--color-primary-700)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
                  >
                    hello@maisonlumiere.example
                  </a>
                </li>
              </ul>
            </div>

            {/* Getting here */}
            <div className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-[var(--space-6)]">
              <h3 className="font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-500)]">
                Getting here
              </h3>
              <ul className="mt-[var(--space-4)] flex flex-col gap-[var(--space-3)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] leading-[var(--line-height-body)] text-[color:var(--color-text)]">
                <li className="flex items-start gap-[var(--space-3)]">
                  <Train
                    className="mt-[var(--space-1)] h-[var(--space-3)] w-[var(--space-3)] shrink-0 text-[color:var(--color-primary-500)]"
                    aria-hidden="true"
                  />
                  <span>
                    Two blocks from Central Station (lines 1, 2, 3, A, C, E). Exit at Carmine
                    Street.
                  </span>
                </li>
                <li className="flex items-start gap-[var(--space-3)]">
                  <CarFront
                    className="mt-[var(--space-1)] h-[var(--space-3)] w-[var(--space-3)] shrink-0 text-[color:var(--color-primary-500)]"
                    aria-hidden="true"
                  />
                  <span>
                    Valet parking available Tuesday – Saturday from 5:00 PM. $25 for the evening.
                  </span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

export default FineDiningContactPage;
