/**
 * LATTICE Theme #1 — Fine Dining
 * Home page — the entry point for the theme preview.
 *
 * Composition (the "Theater of Dining" sequence):
 *   1. Hero (existing) — full-bleed image + bottom-left text (Design Law 4)
 *   2. Welcome / House — brand statement, spacious density, hairline frame
 *   3. Tonight's tasting — 3 featured courses, hairline-ruled cards
 *   4. The chef — pull-quote + portrait meta
 *   5. Reserve CTA — dark inverse section, side-by-side CTAs
 *   6. Press / Accolades — 3-up strip with hairline rules
 *   (Header / Footer are mounted by the app route, not the page.)
 *
 * Skill 2 — W3C Design Tokens
 *   Every visual primitive is a `var(--token-*)` reference. No hex,
 *   no px literals.
 */

import * as React from "react";
import { FineDiningHero } from "../components/Hero";
import type { MenuCourse } from "../components/Menu";
import { ArrowUpRight, Quote, Sparkles, Utensils, Star } from "lucide-react";

const FEATURED_COURSES: Array<{ eyebrow: string; course: MenuCourse }> = [
  {
    eyebrow: "First",
    course: {
      id: "featured-1",
      name: "Hamachi, yuzu kosho, pickled rose",
      description:
        "Day-boat yellowtail, brief cure in yuzu kosho, a single drop of pickled-rose oil, finished with sea grapes from the Brittany coast.",
      price: "MP",
    },
  },
  {
    eyebrow: "Main",
    course: {
      id: "featured-2",
      name: "Aged duck, cherry, smoked lardo",
      description:
        "Long-aged duck breast from the Périgord, lacquered in sour cherry, draped with smoked lardo, dressed with a charred shallot jus.",
      price: "$78",
      tags: ["gluten-free"],
    },
  },
  {
    eyebrow: "Dessert",
    course: {
      id: "featured-3",
      name: "Mille-feuille, vanilla, brown butter",
      description:
        "Caramelised puff pastry layered with Tahitian vanilla crème, brown-butter ice cream, a single shard of spun sugar.",
      price: "$24",
      tags: ["vegetarian"],
    },
  },
];

const PRESS = [
  { name: "The New York Times", note: "★ ★ ★ ★  exceptional" },
  { name: "Eater", note: "A dining room of quiet authority" },
  { name: "Michelin Guide", note: "1 Star · 2026" },
];

export function FineDiningHome() {
  return (
    <>
      {/* ─── 1. Hero ─────────────────────────────────────────────── */}
      <FineDiningHero
        eyebrow="Maison Lumière"
        meta="Est. 1998 · Downtown"
        headline="An evening,"
        headlineAccent="set with care."
        subhead="Seasonal tasting menus, an award-winning sommelier, and a dining room built for conversation. Reservations open thirty days in advance."
        primaryCtaLabel="Reserve a table"
        primaryCtaHref="#reserve"
        secondaryCtaLabel="View menu"
        secondaryCtaHref="#menu"
      />

      {/* ─── 2. Welcome / The House ──────────────────────────────── */}
      <section
        id="welcome"
        aria-labelledby="welcome-heading"
        className="relative bg-[color:var(--color-surface)] py-[var(--space-10)] md:py-[var(--space-11)]"
      >
        {/* Hairline top frame (the reference's signature) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[color:var(--color-border)] opacity-60"
        />

        <div className="mx-auto grid w-full max-w-[var(--container-max)] grid-cols-1 gap-[var(--space-8)] px-[var(--margin-mobile)] md:grid-cols-12 md:px-[var(--margin-desktop)]">
          <div className="md:col-span-5">
            <p className="inline-flex items-center gap-[var(--space-3)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-500)]">
              <span
                aria-hidden="true"
                className="block h-px w-8 bg-[color:var(--color-primary-500)]"
              />
              The House
            </p>
            <h2
              id="welcome-heading"
              className="mt-[var(--space-5)] font-[family-name:var(--font-display)] text-[length:clamp(2.25rem,5vw,4.25rem)] font-[var(--font-weight-display)] leading-[var(--line-height-display)] tracking-[var(--letter-spacing-display)] text-[color:var(--color-text)]"
            >
              A small dining room.{" "}
              <em className="italic text-[color:var(--color-primary-500)]">A long evening.</em> A
              single, considered menu.
            </h2>
          </div>
          <div className="md:col-span-7 md:pt-[var(--space-2)]">
            <p className="font-[family-name:var(--font-body)] text-[length:var(--space-5)] leading-[var(--line-height-body)] text-[color:var(--color-text)]">
              We seat thirty-six guests across twelve tables each evening. Our menu is set daily by
              Chef Élise Marchand from what the markets brought in that morning, and our wine list
              leans toward small growers you will not find in a chain.
            </p>
            <p className="mt-[var(--space-5)] font-[family-name:var(--font-body)] text-[length:var(--space-5)] leading-[var(--line-height-body)] text-[color:var(--color-text)]">
              Reservations are released at 9:00 AM, thirty days in advance. We hold a few seats each
              evening for walk-ins at the bar; call at five to check.
            </p>
            <a
              href="#menu"
              className="mt-[var(--space-7)] group inline-flex items-center gap-[var(--space-3)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-500)] underline-offset-4 transition-colors duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:text-[color:var(--color-primary-700)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
            >
              <span
                aria-hidden="true"
                className="block h-px w-8 bg-[color:var(--color-primary-500)] transition-all duration-[var(--duration-base)] ease-[var(--easing-standard)] group-hover:w-12"
              />
              See tonight&apos;s menu
              <ArrowUpRight className="h-[var(--space-4)] w-[var(--space-4)]" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* ─── 3. Tonight's tasting ───────────────────────────────── */}
      <section
        id="menu"
        aria-labelledby="tonight-heading"
        className="relative bg-[color:var(--color-surface-alt)] py-[var(--space-10)] md:py-[var(--space-11)]"
      >
        <div className="mx-auto w-full max-w-[var(--container-max)] px-[var(--margin-mobile)] md:px-[var(--margin-desktop)]">
          <div className="flex flex-col items-start justify-between gap-[var(--space-5)] md:flex-row md:items-end">
            <div>
              <p className="inline-flex items-center gap-[var(--space-3)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-500)]">
                <span
                  aria-hidden="true"
                  className="block h-px w-8 bg-[color:var(--color-primary-500)]"
                />
                Tonight
              </p>
              <h2
                id="tonight-heading"
                className="mt-[var(--space-4)] font-[family-name:var(--font-display)] text-[length:clamp(2rem,4vw,3.5rem)] font-[var(--font-weight-display)] leading-[var(--line-height-display)] tracking-[var(--letter-spacing-display)] text-[color:var(--color-text)]"
              >
                From this evening&apos;s tasting
              </h2>
            </div>
            <a
              href="/themes/fine-dining/menu"
              className="inline-flex items-center gap-[var(--space-2)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-500)] underline-offset-4 transition-colors duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:text-[color:var(--color-primary-700)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
            >
              The full menu
              <ArrowUpRight className="h-[var(--space-3)] w-[var(--space-3)]" aria-hidden="true" />
            </a>
          </div>

          <ul className="mt-[var(--space-8)] grid grid-cols-1 gap-[var(--space-5)] md:grid-cols-3">
            {FEATURED_COURSES.map(({ eyebrow, course }) => (
              <li
                key={course.id}
                className="group flex flex-col gap-[var(--space-4)] rounded-[var(--radius-sm)] border border-[color:var(--color-border)] bg-[color:var(--color-surface-card)] p-[var(--space-6)] transition-[box-shadow,transform,border-color] duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:border-[color:var(--color-primary-700)] hover:shadow-[var(--shadow-md)] hover:-translate-y-px"
              >
                <div className="flex items-baseline justify-between gap-[var(--space-3)]">
                  <span className="inline-flex items-center gap-[var(--space-2)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-500)]">
                    <span
                      aria-hidden="true"
                      className="block h-px w-4 bg-[color:var(--color-primary-500)]"
                    />
                    {eyebrow}
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-[length:var(--space-4)] font-[var(--font-weight-display)] italic text-[color:var(--color-primary-300)]">
                    {course.price}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-[length:var(--space-5)] font-[var(--font-weight-display)] leading-[var(--line-height-subhead)] tracking-[var(--letter-spacing-display)] text-[color:var(--color-text)]">
                  {course.name}
                </h3>
                <p className="font-[family-name:var(--font-body)] text-[length:var(--space-4)] leading-[var(--line-height-body)] text-[color:var(--color-text-muted)]">
                  {course.description}
                </p>
                {course.tags && course.tags.length > 0 && (
                  <ul className="mt-auto flex flex-wrap gap-[var(--space-2)] pt-[var(--space-3)]">
                    {course.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-[var(--radius-full)] border border-[color:var(--color-border)] px-[var(--space-3)] py-[var(--space-1)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] text-[color:var(--color-text-muted)]"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── 4. The chef ────────────────────────────────────────── */}
      <section
        id="story"
        aria-labelledby="chef-heading"
        className="relative bg-[color:var(--color-surface)] py-[var(--space-10)] md:py-[var(--space-11)]"
      >
        <div className="mx-auto grid w-full max-w-[var(--container-max)] grid-cols-1 items-start gap-[var(--space-8)] px-[var(--margin-mobile)] md:grid-cols-12 md:px-[var(--margin-desktop)]">
          <div className="md:col-span-5">
            <p className="inline-flex items-center gap-[var(--space-3)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-500)]">
              <span
                aria-hidden="true"
                className="block h-px w-8 bg-[color:var(--color-primary-500)]"
              />
              The Chef
            </p>
            <h2
              id="chef-heading"
              className="mt-[var(--space-4)] font-[family-name:var(--font-display)] text-[length:clamp(2rem,4vw,3.5rem)] font-[var(--font-weight-display)] leading-[var(--line-height-display)] tracking-[var(--letter-spacing-display)] text-[color:var(--color-text)]"
            >
              Élise Marchand
            </h2>
            <p className="mt-[var(--space-3)] font-[family-name:var(--font-display)] text-[length:var(--space-4)] italic text-[color:var(--color-primary-300)]">
              Chef &amp; Owner
            </p>
          </div>
          <div className="md:col-span-7 md:pt-[var(--space-2)]">
            <Quote
              className="h-[var(--space-7)] w-[var(--space-7)] text-[color:var(--color-primary-500)] opacity-80"
              aria-hidden="true"
            />
            <blockquote className="mt-[var(--space-3)] font-[family-name:var(--font-display)] text-[length:clamp(1.5rem,2.5vw,2rem)] font-[var(--font-weight-display-italic)] italic leading-[var(--line-height-subhead)] text-[color:var(--color-text)]">
              &ldquo;A tasting menu is a conversation you have with the season. You get one question
              a day. Today it was: what did the harbour bring in?&rdquo;
            </blockquote>
            <p className="mt-[var(--space-6)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] leading-[var(--line-height-body)] text-[color:var(--color-text)]">
              Élise trained in Lyon, then spent six years under chef Anne-Sophie Pic before opening
              Maison Lumière in 1998. She is the mother of the duck-and-cherry dish that has been on
              the menu, in some form, every summer since.
            </p>
            <a
              href="/themes/fine-dining/about"
              className="mt-[var(--space-6)] group inline-flex items-center gap-[var(--space-3)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-500)] underline-offset-4 transition-colors duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:text-[color:var(--color-primary-700)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
            >
              <span
                aria-hidden="true"
                className="block h-px w-8 bg-[color:var(--color-primary-500)] transition-all duration-[var(--duration-base)] ease-[var(--easing-standard)] group-hover:w-12"
              />
              Read the full story
              <ArrowUpRight className="h-[var(--space-3)] w-[var(--space-3)]" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* ─── 5. Reserve CTA ─────────────────────────────────────── */}
      <section
        id="reserve"
        aria-labelledby="reserve-heading"
        className="relative bg-[color:var(--color-surface-dark)] py-[var(--space-10)] text-[color:var(--color-on-primary)] md:py-[var(--space-11)]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[color:var(--color-border)] opacity-60"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[color:var(--color-border)] opacity-60"
        />

        <div className="mx-auto grid w-full max-w-[var(--container-max)] grid-cols-1 items-center gap-[var(--space-7)] px-[var(--margin-mobile)] md:grid-cols-12 md:px-[var(--margin-desktop)]">
          <div className="md:col-span-7">
            <p className="inline-flex items-center gap-[var(--space-3)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-300)]">
              <Sparkles className="h-[var(--space-3)] w-[var(--space-3)]" aria-hidden="true" />
              Thirty days open
            </p>
            <h2
              id="reserve-heading"
              className="mt-[var(--space-3)] font-[family-name:var(--font-display)] text-[length:clamp(2.25rem,5vw,4.5rem)] font-[var(--font-weight-display)] leading-[var(--line-height-display)] tracking-[var(--letter-spacing-display)] text-[color:var(--color-on-primary)]"
            >
              Reserve{" "}
              <em className="italic text-[color:var(--color-primary-300)]">your evening.</em>
            </h2>
            <p className="mt-[var(--space-4)] max-w-xl font-[family-name:var(--font-body)] text-[length:var(--space-5)] leading-[var(--line-height-body)] text-[color:var(--color-primary-100)]">
              Tables for two to twelve. The full menu is served to the entire table. Children ten
              and up are warmly welcomed; younger guests by special arrangement.
            </p>
          </div>
          <div className="flex flex-col gap-[var(--space-3)] md:col-span-5 md:items-end">
            <a
              href="/themes/fine-dining/reservations"
              className="inline-flex w-full items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-sm)] bg-[color:var(--color-primary-500)] px-[var(--space-6)] py-[var(--space-4)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-on-primary)] shadow-[var(--shadow-colored)] transition-[background-color,box-shadow,transform] duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:bg-[color:var(--color-primary-700)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2 sm:w-auto"
            >
              <Utensils className="h-[var(--space-4)] w-[var(--space-4)]" aria-hidden="true" />
              Reserve a table
            </a>
            <a
              href="tel:+15550123456"
              className="inline-flex w-full items-center justify-center rounded-[var(--radius-sm)] border border-[color:var(--color-primary-700)] bg-transparent px-[var(--space-6)] py-[var(--space-3)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-on-primary)] transition-[background-color,border-color] duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:border-[color:var(--color-primary-500)] hover:bg-[color:rgba(250,246,238,0.06)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2 sm:w-auto"
            >
              Or call +1 (555) 012-3456
            </a>
          </div>
        </div>
      </section>

      {/* ─── 6. Press / Accolades strip ────────────────────────── */}
      <section
        id="press"
        aria-labelledby="press-heading"
        className="relative bg-[color:var(--color-surface)] py-[var(--space-9)] md:py-[var(--space-10)]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[color:var(--color-border)] opacity-50"
        />
        <div className="mx-auto w-full max-w-[var(--container-max)] px-[var(--margin-mobile)] md:px-[var(--margin-desktop)]">
          <h2
            id="press-heading"
            className="text-center font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-text-muted)]"
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
                <span className="inline-flex items-center gap-[var(--space-2)] font-[family-name:var(--font-display)] text-[length:var(--space-5)] font-[var(--font-weight-display)] tracking-[var(--letter-spacing-display)] text-[color:var(--color-text)]">
                  <Star
                    className="h-[var(--space-3)] w-[var(--space-3)] fill-[color:var(--color-primary-500)] text-[color:var(--color-primary-500)]"
                    aria-hidden="true"
                  />
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
    </>
  );
}

export default FineDiningHome;
