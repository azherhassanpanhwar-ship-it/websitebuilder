/**
 * LATTICE Theme #1 — Fine Dining
 * Reservations page — combines the shared ReservationForm with a
 * short preamble, an hours card, and a contact card.
 */

import * as React from "react";
import { Clock, MapPin, Phone, Mail } from "lucide-react";
import { ReservationForm } from "../components/ReservationForm";

export function FineDiningReservationsPage() {
  return (
    <>
      {/* ─── Page header ─────────────────────────────────────── */}
      <section
        aria-labelledby="resv-heading"
        className="bg-[color:var(--color-surface)] py-[var(--space-10)] md:py-[var(--space-11)]"
      >
        <div className="mx-auto w-full max-w-[1440px] px-[var(--space-5)] md:px-[var(--space-6)]">
          <p className="font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-500)]">
            Reservations
          </p>
          <h1
            id="resv-heading"
            className="mt-[var(--space-3)] max-w-3xl font-[family-name:var(--font-display)] text-[length:clamp(2.25rem,5vw,4.5rem)] font-[var(--font-weight-display)] leading-[var(--line-height-display)] tracking-[var(--letter-spacing-display)] text-[color:var(--color-text)]"
          >
            Reserve your evening.
          </h1>
          <p className="mt-[var(--space-5)] max-w-2xl font-[family-name:var(--font-body)] text-[length:var(--space-5)] leading-[var(--line-height-body)] text-[color:var(--color-text-muted)]">
            Reservations open at 9:00 AM, thirty days in advance. We seat from 5:30 to 9:30 PM,
            Tuesday through Saturday. The full menu is served to the entire table.
          </p>
        </div>
      </section>

      {/* ─── Form + sidebar ─────────────────────────────────── */}
      <section
        aria-label="Reservation form and details"
        className="bg-[color:var(--color-surface-alt)] py-[var(--space-10)]"
      >
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-[var(--space-9)] px-[var(--space-5)] md:grid-cols-12 md:px-[var(--space-6)]">
          <div className="md:col-span-8">
            <h2 className="font-[family-name:var(--font-display)] text-[length:clamp(1.75rem,3vw,2.5rem)] font-[var(--font-weight-display)] leading-[var(--line-height-display)] tracking-[var(--letter-spacing-display)] text-[color:var(--color-text)]">
              Tell us about your evening.
            </h2>
            <p className="mt-[var(--space-3)] max-w-prose font-[family-name:var(--font-body)] text-[length:var(--space-4)] leading-[var(--line-height-body)] text-[color:var(--color-text-muted)]">
              We will confirm by email within the hour during service, or first thing the next
              morning if your request arrives overnight. For same-day requests, please call.
            </p>
            <div className="mt-[var(--space-7)] rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-[var(--space-6)] shadow-[var(--shadow-sm)] md:p-[var(--space-8)]">
              <ReservationForm />
            </div>
          </div>

          <aside className="md:col-span-4 flex flex-col gap-[var(--space-6)]">
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

            {/* Contact */}
            <div className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-[var(--space-6)] shadow-[var(--shadow-sm)]">
              <h3 className="font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-500)]">
                Reach us
              </h3>
              <ul className="mt-[var(--space-4)] flex flex-col gap-[var(--space-3)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] text-[color:var(--color-text)]">
                <li className="flex items-start gap-[var(--space-3)]">
                  <MapPin
                    className="mt-[var(--space-1)] h-[var(--space-3)] w-[var(--space-3)] shrink-0 text-[color:var(--color-primary-500)]"
                    aria-hidden="true"
                  />
                  <span>12 Rue de la Paix · Downtown</span>
                </li>
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
                    href="mailto:reservations@maisonlumiere.example"
                    className="rounded-[var(--radius-xs)] underline-offset-4 transition-colors duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:text-[color:var(--color-primary-700)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
                  >
                    reservations@maisonlumiere.example
                  </a>
                </li>
              </ul>
            </div>

            {/* Private dining */}
            <div className="rounded-[var(--radius-md)] border border-[color:var(--color-primary-200)] bg-[color:var(--color-surface)] p-[var(--space-6)]">
              <h3 className="font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-500)]">
                Private dining
              </h3>
              <p className="mt-[var(--space-3)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] leading-[var(--line-height-body)] text-[color:var(--color-text)]">
                The cellar room seats fourteen and is available for private events. For full
                restaurant buy-outs (up to thirty-six), please contact our events team.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

export default FineDiningReservationsPage;
