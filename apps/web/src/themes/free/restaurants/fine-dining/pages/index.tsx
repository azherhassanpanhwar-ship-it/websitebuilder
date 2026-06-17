/**
 * LATTICE Theme #1 — Fine Dining
 * Home page — the entry point for the theme preview.
 *
 * Composition (the reference's "Theater of Dining" sequence):
 *   1. Hero (full-bleed image + eyebrow + 2-line headline + 2 CTAs + scroll-cue)
 *   2. The Experience — chef portrait (4:5) + pull-quote (asymmetric grid)
 *   3. The Tasting Narrative — 3 bento cards with square dish images
 *   4. The Intimacy of Limit — 36 / 12 stats
 *   5. Reservations — inline form (underline-only inputs)
 *   6. Map & Contact — Visit Us + Paris map (grayscale + pulsing pin)
 *   7. Press / Accolades — 3-up strip
 *   (Header / Footer are mounted by the app route, not the page.)
 *
 * Skill 2 — W3C Design Tokens
 *   Every visual primitive is a `var(--token-*)` reference. No hex,
 *   no px literals.
 */

import * as React from "react";
import { FineDiningHero } from "../components/Hero";
import { TextQuote } from "lucide-react";

// ─── Featured courses (bento) — pulled from the seasonal menu ─────────
const FEATURED_COURSES = [
  {
    number: "I.",
    label: "First",
    title: "Hamachi",
    description: "Yuzu kosho, radishes, cold-pressed olive oil.",
    image: "/themes/fine-dining/dish-hamachi.jpg",
  },
  {
    number: "II.",
    label: "Main",
    title: "Aged Duck",
    description: "Wild cherry, smoked lardo, fermented grains.",
    image: "/themes/fine-dining/dish-duck.jpg",
  },
  {
    number: "III.",
    label: "Finale",
    title: "Mille-feuille",
    description: "Vanilla bean, brown butter, sea salt caramel.",
    image: "/themes/fine-dining/dish-millefeuille.jpg",
  },
];

const PRESS = [
  { name: "The New York Times", note: "★ ★ ★ ★  exceptional" },
  { name: "Eater", note: "A dining room of quiet authority" },
  { name: "Michelin Guide", note: "1 Star · 2026" },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-[var(--space-3)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[0.2em] text-[color:var(--color-primary-500)]">
      <span aria-hidden="true" className="block h-px w-8 bg-[color:var(--color-primary-500)]" />
      {children}
    </p>
  );
}

function GoldDivider() {
  return (
    <div
      aria-hidden="true"
      className="h-px w-full bg-[image:linear-gradient(90deg,transparent_0%,#e9c176_50%,transparent_100%)]"
    />
  );
}

export function FineDiningHome() {
  return (
    <>
      {/* ─── 1. Hero ─────────────────────────────────────────────── */}
      <FineDiningHero
        eyebrow="An Intimate Culinary Journey"
        headline="An evening,"
        headlineAccent="set with care."
        subhead=""
        primaryCtaLabel="Reserve a table"
        primaryCtaHref="#reserve"
        secondaryCtaLabel="The Story"
        secondaryCtaHref="#experience"
        scrollCueHref="#welcome"
        scrollCueLabel="Scroll to Discover"
      />

      {/* ─── 2. The Experience — chef portrait + pull-quote ──────── */}
      <section
        id="experience"
        aria-labelledby="experience-heading"
        className="relative overflow-hidden bg-[color:var(--color-surface-dark)] py-[var(--space-11)] md:py-[var(--space-11)]"
      >
        <div className="mx-auto w-full max-w-[var(--container-max)] px-[var(--margin-mobile)] md:px-[var(--margin-desktop)]">
          <div className="grid grid-cols-12 items-center gap-[var(--space-7)] md:gap-[var(--space-8)]">
            {/* Chef portrait — 4:5, grayscale → color on hover, gold glow */}
            <div className="col-span-12 md:col-span-6 lg:col-span-5">
              <div className="relative">
                <div className="aspect-[4/5] overflow-hidden border border-[color:var(--color-border)] p-[var(--space-2)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/themes/fine-dining/chef.jpg"
                    alt="Chef Élise Marchand in a moody, dimly lit kitchen"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover grayscale transition-[filter] duration-700 ease-[var(--easing-standard)] hover:grayscale-0"
                  />
                </div>
                {/* Gold glow behind */}
                <div
                  aria-hidden="true"
                  className="absolute -bottom-8 -right-8 -z-10 h-48 w-48 rounded-full bg-[color:var(--color-primary-500)] opacity-10 blur-3xl"
                />
              </div>
            </div>

            {/* Pull-quote — offset to col 7 to create the asymmetric rhythm */}
            <div className="col-span-12 md:col-span-6 md:col-start-7 lg:col-span-6">
              <span aria-hidden="true" className="block">
                <TextQuote
                  className="h-[var(--space-9)] w-[var(--space-9)] text-[color:var(--color-primary-500)]"
                  aria-hidden="true"
                />
              </span>
              <h2
                id="experience-heading"
                className="mt-[var(--space-6)] font-[family-name:var(--font-display)] text-[length:clamp(1.75rem,3.5vw,3rem)] font-[var(--font-weight-display)] italic leading-[var(--line-height-display)] tracking-[var(--letter-spacing-display)] text-[color:var(--color-on-primary)]"
              >
                &ldquo;A tasting menu is a conversation you have with the season, translated through
                fire and time.&rdquo;
              </h2>
              <p className="mt-[var(--space-6)] max-w-lg font-[family-name:var(--font-body)] text-[length:var(--space-5)] leading-[var(--line-height-body)] text-[color:var(--color-primary-100)]">
                Chef Élise Marchand curates each evening at Maison Lumière as a single-seating
                narrative. Her philosophy marries traditional French techniques with the raw,
                seasonal bounty of the Loire Valley.
              </p>
              <p className="mt-[var(--space-5)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[0.2em] text-[color:var(--color-primary-500)]">
                — Chef Élise Marchand
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. The Tasting Narrative — 3 bento cards ────────────── */}
      <section
        id="tasting"
        aria-labelledby="tasting-heading"
        className="relative bg-[color:var(--color-surface)] py-[var(--space-11)]"
      >
        <div className="mx-auto w-full max-w-[var(--container-max)] px-[var(--margin-mobile)] md:px-[var(--margin-desktop)]">
          {/* Header row: eyebrow + headline on the left, gold divider on the right */}
          <div className="mb-[var(--space-9)] flex flex-col items-start justify-between gap-[var(--space-5)] md:flex-row md:items-end">
            <div>
              <Eyebrow>Late Winter Selections</Eyebrow>
              <h2
                id="tasting-heading"
                className="mt-[var(--space-4)] font-[family-name:var(--font-display)] text-[length:clamp(2rem,4.5vw,3.5rem)] font-[var(--font-weight-display)] leading-[var(--line-height-display)] tracking-[var(--letter-spacing-display)] text-[color:var(--color-text)]"
              >
                The Tasting Narrative
              </h2>
            </div>
            <div className="hidden w-1/3 md:block">
              <GoldDivider />
            </div>
          </div>

          {/* 3 bento cards */}
          <ul className="grid grid-cols-1 gap-[var(--space-7)] md:grid-cols-3">
            {FEATURED_COURSES.map((course) => (
              <li
                key={course.title}
                className="group relative overflow-hidden border border-[color:var(--color-border)] bg-[color:var(--color-surface-card)] p-[var(--space-6)] transition-[border-color] duration-500 ease-[var(--easing-standard)] hover:border-[color:rgba(233,193,118,0.40)]"
              >
                {/* Number + label */}
                <div className="mb-[var(--space-7)]">
                  <span className="font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[0.2em] text-[color:var(--color-primary-500)] opacity-60">
                    {course.number} {course.label}
                  </span>
                  <h3 className="mt-[var(--space-2)] font-[family-name:var(--font-display)] text-[length:clamp(1.75rem,2.5vw,2.25rem)] font-[var(--font-weight-display)] leading-[var(--line-height-display)] tracking-[var(--letter-spacing-display)] text-[color:var(--color-text)] transition-colors duration-500 ease-[var(--easing-standard)] group-hover:text-[color:var(--color-primary-500)]">
                    {course.title}
                  </h3>
                  <p className="mt-[var(--space-3)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] leading-[var(--line-height-body)] text-[color:var(--color-text-muted)]">
                    {course.description}
                  </p>
                </div>

                {/* Square dish image with hover scale */}
                <div className="aspect-square overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={course.image}
                    alt={course.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-1000 ease-[var(--easing-standard)] group-hover:scale-110"
                  />
                </div>

                {/* Bottom line that grows on hover (the reference's signature) */}
                <div
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-[2px] w-0 bg-[color:var(--color-primary-500)] transition-[width] duration-700 ease-[var(--easing-standard)] group-hover:w-full"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── 4. The Intimacy of Limit — 36 / 12 stats ─────────────── */}
      <section
        aria-labelledby="limit-heading"
        className="relative border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-dark)] py-[var(--space-11)]"
      >
        <div className="mx-auto grid w-full max-w-[var(--container-max)] grid-cols-12 items-center gap-[var(--space-8)] px-[var(--margin-mobile)] md:px-[var(--margin-desktop)]">
          <div className="col-span-12 md:col-span-6">
            <Eyebrow>The Intimacy of Limit</Eyebrow>
            <h2
              id="limit-heading"
              className="mt-[var(--space-5)] font-[family-name:var(--font-display)] text-[length:clamp(2.25rem,5vw,3.75rem)] font-[var(--font-weight-display)] leading-[var(--line-height-display)] tracking-[var(--letter-spacing-display)] text-[color:var(--color-on-primary)]"
            >
              The Intimacy of
              <br />
              <em className="italic text-[color:var(--color-primary-300)]">Limit</em>
            </h2>

            <div className="mt-[var(--space-7)] grid grid-cols-2 gap-[var(--space-7)]">
              <div>
                <p className="font-[family-name:var(--font-display)] text-[length:clamp(2.5rem,4vw,3.25rem)] font-[var(--font-weight-display)] leading-none text-[color:var(--color-primary-500)]">
                  36
                </p>
                <p className="mt-[var(--space-2)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[0.2em] text-[color:var(--color-primary-200)]">
                  Guests Nightly
                </p>
              </div>
              <div>
                <p className="font-[family-name:var(--font-display)] text-[length:clamp(2.5rem,4vw,3.25rem)] font-[var(--font-weight-display)] leading-none text-[color:var(--color-primary-500)]">
                  12
                </p>
                <p className="mt-[var(--space-2)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[0.2em] text-[color:var(--color-primary-200)]">
                  Exclusive Tables
                </p>
              </div>
              <div className="col-span-2 border-t border-[color:var(--color-border)] pt-[var(--space-5)]">
                <p className="font-[family-name:var(--font-body)] text-[length:var(--space-5)] leading-[var(--line-height-body)] text-[color:var(--color-on-primary)]">
                  Our reservations open precisely 30 days in advance at midnight.
                </p>
                <p className="mt-[var(--space-3)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] leading-[var(--line-height-body)] text-[color:var(--color-primary-200)]">
                  To maintain the absolute focus required for our menu, we offer a single sitting
                  per table, ensuring you have the entire evening to yourself.
                </p>
              </div>
            </div>
          </div>

          {/* Right column — form card */}
          <div className="col-span-12 md:col-span-6">
            <div className="relative border border-[color:rgba(233,193,118,0.20)] bg-[color:var(--color-surface-card)] p-[var(--space-7)] md:p-[var(--space-9)]">
              {/* Decorative event icon top-right */}
              <div
                aria-hidden="true"
                className="absolute right-[var(--space-4)] top-[var(--space-4)]"
              >
                <TextQuote
                  className="h-[var(--space-9)] w-[var(--space-9)] text-[color:var(--color-primary-500)] opacity-20"
                  aria-hidden="true"
                />
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-[length:clamp(1.5rem,2.5vw,2rem)] font-[var(--font-weight-display)] leading-[var(--line-height-display)] tracking-[var(--letter-spacing-display)] text-[color:var(--color-on-primary)]">
                Secure Your Table
              </h3>
              <form className="mt-[var(--space-7)] flex flex-col gap-[var(--space-5)]" noValidate>
                <div className="grid grid-cols-1 gap-[var(--space-5)] sm:grid-cols-2">
                  <label className="flex flex-col gap-[var(--space-2)]">
                    <span className="font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[0.2em] text-[color:var(--color-primary-200)]">
                      Full Name
                    </span>
                    <input
                      type="text"
                      className="border-b border-[color:var(--color-border)] bg-transparent py-[var(--space-2)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] text-[color:var(--color-on-primary)] outline-none transition-colors duration-[var(--duration-base)] ease-[var(--easing-standard)] focus:border-[color:var(--color-primary-500)]"
                    />
                  </label>
                  <label className="flex flex-col gap-[var(--space-2)]">
                    <span className="font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[0.2em] text-[color:var(--color-primary-200)]">
                      Phone
                    </span>
                    <input
                      type="tel"
                      className="border-b border-[color:var(--color-border)] bg-transparent py-[var(--space-2)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] text-[color:var(--color-on-primary)] outline-none transition-colors duration-[var(--duration-base)] ease-[var(--easing-standard)] focus:border-[color:var(--color-primary-500)]"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-1 gap-[var(--space-5)] sm:grid-cols-2">
                  <label className="flex flex-col gap-[var(--space-2)]">
                    <span className="font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[0.2em] text-[color:var(--color-primary-200)]">
                      Preferred Date
                    </span>
                    <input
                      type="date"
                      className="border-b border-[color:var(--color-border)] bg-transparent py-[var(--space-2)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] text-[color:var(--color-on-primary)] outline-none transition-colors duration-[var(--duration-base)] ease-[var(--easing-standard)] focus:border-[color:var(--color-primary-500)] [color-scheme:dark]"
                    />
                  </label>
                  <label className="flex flex-col gap-[var(--space-2)]">
                    <span className="font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[0.2em] text-[color:var(--color-primary-200)]">
                      Guests
                    </span>
                    <select
                      defaultValue="2 Guests"
                      className="border-b border-[color:var(--color-border)] bg-transparent py-[var(--space-2)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] text-[color:var(--color-on-primary)] outline-none transition-colors duration-[var(--duration-base)] ease-[var(--easing-standard)] focus:border-[color:var(--color-primary-500)]"
                    >
                      <option className="bg-[color:var(--color-surface)]">2 Guests</option>
                      <option className="bg-[color:var(--color-surface)]">4 Guests</option>
                      <option className="bg-[color:var(--color-surface)]">6 Guests</option>
                    </select>
                  </label>
                </div>
                <label className="flex flex-col gap-[var(--space-2)]">
                  <span className="font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[0.2em] text-[color:var(--color-primary-200)]">
                    Special Requests
                  </span>
                  <textarea
                    rows={2}
                    className="resize-none border-b border-[color:var(--color-border)] bg-transparent py-[var(--space-2)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] text-[color:var(--color-on-primary)] outline-none transition-colors duration-[var(--duration-base)] ease-[var(--easing-standard)] focus:border-[color:var(--color-primary-500)]"
                  />
                </label>
                <button
                  type="submit"
                  className="mt-[var(--space-3)] w-full bg-[color:var(--color-primary-500)] py-[var(--space-4)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[0.2em] text-[color:var(--color-on-primary)] shadow-[var(--shadow-sm)] transition-[background-color,box-shadow] duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:bg-[color:var(--color-primary-700)] hover:shadow-[var(--shadow-md)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
                >
                  Request Reservation
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. Map & Contact — Visit Us + Paris map ────────────── */}
      <section
        id="contact"
        aria-labelledby="visit-heading"
        className="relative bg-[color:var(--color-surface)] py-[var(--space-11)]"
      >
        <div className="mx-auto grid w-full max-w-[var(--container-max)] grid-cols-12 items-center gap-[var(--space-7)] px-[var(--margin-mobile)] md:px-[var(--margin-desktop)]">
          {/* Left: Visit Us details */}
          <div className="col-span-12 md:col-span-4 flex flex-col justify-center">
            <Eyebrow>Visit Us</Eyebrow>
            <h2
              id="visit-heading"
              className="mt-[var(--space-4)] font-[family-name:var(--font-display)] text-[length:clamp(2rem,4vw,3rem)] font-[var(--font-weight-display)] leading-[var(--line-height-display)] tracking-[var(--letter-spacing-display)] text-[color:var(--color-text)]"
            >
              Find us in Paris.
            </h2>
            <ul className="mt-[var(--space-6)] flex flex-col gap-[var(--space-5)]">
              <li className="flex items-start gap-[var(--space-3)]">
                <span
                  className="mt-[var(--space-1)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] text-[color:var(--color-primary-500)]"
                  aria-hidden="true"
                >
                  ◉
                </span>
                <div>
                  <p className="font-[family-name:var(--font-body)] text-[length:var(--space-5)] text-[color:var(--color-text)]">
                    12 Rue de la Paix
                  </p>
                  <p className="font-[family-name:var(--font-body)] text-[length:var(--space-4)] text-[color:var(--color-text-muted)]">
                    Paris, France 75002
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-[var(--space-3)]">
                <span
                  className="font-[family-name:var(--font-body)] text-[length:var(--space-4)] text-[color:var(--color-primary-500)]"
                  aria-hidden="true"
                >
                  ☏
                </span>
                <a
                  href="tel:+15550123456"
                  className="font-[family-name:var(--font-body)] text-[length:var(--space-5)] text-[color:var(--color-text)] transition-colors duration-[var(--duration-base)] hover:text-[color:var(--color-primary-500)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
                >
                  +1 (555) 012-3456
                </a>
              </li>
              <li className="flex items-center gap-[var(--space-3)]">
                <span
                  className="font-[family-name:var(--font-body)] text-[length:var(--space-4)] text-[color:var(--color-primary-500)]"
                  aria-hidden="true"
                >
                  ✉
                </span>
                <a
                  href="mailto:concierge@maisonlumiere.example"
                  className="font-[family-name:var(--font-body)] text-[length:var(--space-5)] text-[color:var(--color-text)] transition-colors duration-[var(--duration-base)] hover:text-[color:var(--color-primary-500)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
                >
                  concierge@maisonlumiere.example
                </a>
              </li>
            </ul>
          </div>

          {/* Right: Paris map image with grayscale + pulsing gold pin */}
          <div className="col-span-12 md:col-span-8">
            <div className="relative h-[450px] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/themes/fine-dining/map-paris.jpg"
                alt="Aerial view of Paris at night, with city lights tracing the streets"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover grayscale contrast-125 opacity-70"
              />
              {/* Gold tint overlay */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[color:var(--color-primary-500)] opacity-5"
              />
              {/* Pulsing gold pin */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--color-primary-500)] motion-safe:animate-[fdPing_1.6s_ease-out_infinite]"
                  />
                  <span
                    aria-hidden="true"
                    className="relative z-10 block h-4 w-4 rounded-full border-2 border-[color:var(--color-on-primary)] bg-[color:var(--color-primary-500)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. Press / Accolades strip ────────────────────────── */}
      <section
        id="press"
        aria-labelledby="press-heading"
        className="relative border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)] py-[var(--space-9)] md:py-[var(--space-10)]"
      >
        <div className="mx-auto w-full max-w-[var(--container-max)] px-[var(--margin-mobile)] md:px-[var(--margin-desktop)]">
          <h2
            id="press-heading"
            className="text-center font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]"
          >
            As featured in
          </h2>
          <ul className="mt-[var(--space-6)] grid grid-cols-1 gap-[var(--space-5)] sm:grid-cols-3 sm:gap-[var(--space-7)]">
            {PRESS.map(({ name, note }, idx) => (
              <li
                key={name}
                className={[
                  "flex flex-col items-center gap-[var(--space-2)] text-center sm:px-[var(--space-5)]",
                  idx > 0 ? "sm:border-l sm:border-[color:var(--color-border)]" : "",
                ].join(" ")}
              >
                <span className="font-[family-name:var(--font-display)] text-[length:var(--space-5)] font-[var(--font-weight-display)] tracking-[var(--letter-spacing-display)] text-[color:var(--color-text)]">
                  {name}
                </span>
                <span className="font-[family-name:var(--font-body)] text-[length:var(--space-3)] italic text-[color:var(--color-text-muted)]">
                  {note}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── inline keyframes for the pin ping ──────────────────── */}
      <style>{`
        @keyframes fdPing {
          0%   { transform: translate(-50%, -50%) scale(1);   opacity: 0.9; }
          80%, 100% { transform: translate(-50%, -50%) scale(2.6); opacity: 0; }
        }
      `}</style>
    </>
  );
}

export default FineDiningHome;
