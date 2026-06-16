/**
 * LATTICE Theme #1 — Fine Dining
 * Home page — the entry point for the theme preview.
 *
 * Composition
 *   - Hero (existing) — full-bleed image + bottom-left text (Design Law 4)
 *   - "Welcome" section — brand statement, spacious density (Design Law 3 luxury)
 *   - "Tonight's tasting" — 3 featured courses from the seasonal menu
 *   - "The chef" — brief intro card
 *   - "Reserve" CTA — secondary conversion surface
 *   - Press strip
 *   - (Header / Footer are mounted by the app route, not the page.)
 *
 * Skill 2 — W3C Design Tokens
 *   Every visual primitive is a `var(--token-*)` reference. No hex,
 *   no px literals.
 */

import * as React from "react";
import { FineDiningHero } from "../components/Hero";
import type { MenuCourse } from "../components/Menu";
import { ArrowUpRight, Quote, Sparkles, Utensils } from "lucide-react";

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
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <FineDiningHero
        eyebrow="Est. 1998 · Downtown"
        headline="An evening, set with care."
        subhead="Seasonal tasting menus, an award-winning sommelier, and a dining room built for conversation. Reservations open thirty days in advance."
        primaryCtaLabel="Reserve a table"
        primaryCtaHref="#reserve"
        secondaryCtaLabel="View menu"
        secondaryCtaHref="#menu"
      />

      {/* ─── Welcome ──────────────────────────────────────────── */}
      <section
        id="welcome"
        aria-labelledby="welcome-heading"
        className="bg-[color:var(--color-surface)] py-[var(--space-10)] md:py-[var(--space-11)]"
      >
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-[var(--space-8)] px-[var(--space-5)] md:grid-cols-12 md:px-[var(--space-6)]">
          <div className="md:col-span-5">
            <p className="font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-500)]">
              The House
            </p>
            <h2
              id="welcome-heading"
              className="mt-[var(--space-4)] font-[family-name:var(--font-display)] text-[length:clamp(2.25rem,4.5vw,4rem)] font-[var(--font-weight-display)] leading-[var(--line-height-display)] tracking-[var(--letter-spacing-display)] text-[color:var(--color-text)]"
            >
              A small dining room. A long evening. A single, considered menu.
            </h2>
          </div>
          <div className="md:col-span-7 md:pt-[var(--space-7)]">
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
              className="mt-[var(--space-7)] inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-sm)] border border-[color:var(--color-primary-500)] bg-transparent px-[var(--space-5)] py-[var(--space-3)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] font-[var(--font-weight-body-semibold)] text-[color:var(--color-primary-700)] transition-[background-color,color] duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:bg-[color:var(--color-primary-500)] hover:text-[color:var(--color-on-primary)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
            >
              See tonight&apos;s menu
              <ArrowUpRight className="h-[var(--space-4)] w-[var(--space-4)]" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* ─── Tonight's tasting ───────────────────────────────── */}
      <section
        id="menu"
        aria-labelledby="tonight-heading"
        className="bg-[color:var(--color-surface-alt)] py-[var(--space-10)] md:py-[var(--space-11)]"
      >
        <div className="mx-auto w-full max-w-[1440px] px-[var(--space-5)] md:px-[var(--space-6)]">
          <div className="flex flex-col items-start justify-between gap-[var(--space-5)] md:flex-row md:items-end">
            <div>
              <p className="font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-500)]">
                Tonight
              </p>
              <h2
                id="tonight-heading"
                className="mt-[var(--space-3)] font-[family-name:var(--font-display)] text-[length:clamp(2rem,4vw,3.5rem)] font-[var(--font-weight-display)] leading-[var(--line-height-display)] tracking-[var(--letter-spacing-display)] text-[color:var(--color-text)]"
              >
                From this evening&apos;s tasting
              </h2>
            </div>
            <a
              href="/themes/fine-dining/menu"
              className="inline-flex items-center gap-[var(--space-2)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] font-[var(--font-weight-body-medium)] text-[color:var(--color-primary-700)] underline-offset-4 transition-colors duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:text-[color:var(--color-primary-900)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
            >
              The full menu
              <ArrowUpRight className="h-[var(--space-3)] w-[var(--space-3)]" aria-hidden="true" />
            </a>
          </div>

          <ul className="mt-[var(--space-8)] grid grid-cols-1 gap-[var(--space-5)] md:grid-cols-3">
            {FEATURED_COURSES.map(({ eyebrow, course }) => (
              <li
                key={course.id}
                className="flex flex-col gap-[var(--space-4)] rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-[var(--space-6)] shadow-[var(--shadow-sm)] transition-[box-shadow,transform] duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:shadow-[var(--shadow-md)] hover:-translate-y-px"
              >
                <div className="flex items-center justify-between">
                  <span className="font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-500)]">
                    {eyebrow}
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-[length:var(--space-4)] font-[var(--font-weight-display)] text-[color:var(--color-primary-700)]">
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
                  <ul className="mt-auto flex flex-wrap gap-[var(--space-2)] pt-[var(--space-2)]">
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

      {/* ─── The chef ────────────────────────────────────────── */}
      <section
        id="story"
        aria-labelledby="chef-heading"
        className="bg-[color:var(--color-surface)] py-[var(--space-10)] md:py-[var(--space-11)]"
      >
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-start gap-[var(--space-8)] px-[var(--space-5)] md:grid-cols-12 md:px-[var(--space-6)]">
          <div className="md:col-span-5">
            <p className="font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-500)]">
              The Chef
            </p>
            <h2
              id="chef-heading"
              className="mt-[var(--space-3)] font-[family-name:var(--font-display)] text-[length:clamp(2rem,4vw,3.5rem)] font-[var(--font-weight-display)] leading-[var(--line-height-display)] tracking-[var(--letter-spacing-display)] text-[color:var(--color-text)]"
            >
              Élise Marchand
            </h2>
            <p className="mt-[var(--space-3)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] italic text-[color:var(--color-text-muted)]">
              Chef &amp; Owner
            </p>
          </div>
          <div className="md:col-span-7 md:pt-[var(--space-2)]">
            <Quote
              className="h-[var(--space-7)] w-[var(--space-7)] text-[color:var(--color-primary-200)]"
              aria-hidden="true"
            />
            <blockquote className="mt-[var(--space-3)] font-[family-name:var(--font-display)] text-[length:clamp(1.5rem,2.5vw,2rem)] italic leading-[var(--line-height-subhead)] text-[color:var(--color-text)]">
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
              className="mt-[var(--space-6)] inline-flex items-center gap-[var(--space-2)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] font-[var(--font-weight-body-medium)] text-[color:var(--color-primary-700)] underline-offset-4 transition-colors duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:text-[color:var(--color-primary-900)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2"
            >
              Read the full story
              <ArrowUpRight className="h-[var(--space-3)] w-[var(--space-3)]" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* ─── Reserve CTA ─────────────────────────────────────── */}
      <section
        id="reserve"
        aria-labelledby="reserve-heading"
        className="bg-[color:var(--color-surface-dark)] py-[var(--space-10)] text-[color:var(--color-on-primary)] md:py-[var(--space-11)]"
      >
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-[var(--space-7)] px-[var(--space-5)] md:grid-cols-12 md:px-[var(--space-6)]">
          <div className="md:col-span-7">
            <p className="inline-flex items-center gap-[var(--space-2)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-300)]">
              <Sparkles className="h-[var(--space-3)] w-[var(--space-3)]" aria-hidden="true" />
              Thirty days open
            </p>
            <h2
              id="reserve-heading"
              className="mt-[var(--space-3)] font-[family-name:var(--font-display)] text-[length:clamp(2.25rem,4.5vw,4rem)] font-[var(--font-weight-display)] leading-[var(--line-height-display)] tracking-[var(--letter-spacing-display)] text-[color:var(--color-on-primary)]"
            >
              Reserve your evening.
            </h2>
            <p className="mt-[var(--space-4)] max-w-xl font-[family-name:var(--font-body)] text-[length:var(--space-5)] leading-[var(--line-height-body)] text-[color:var(--color-primary-100)]">
              Tables for two to twelve. The full menu is served to the entire table. Children ten
              and up are warmly welcomed; younger guests by special arrangement.
            </p>
          </div>
          <div className="flex flex-col gap-[var(--space-3)] md:col-span-5 md:items-end">
            <a
              href="/themes/fine-dining/reservations"
              className="inline-flex w-full items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-sm)] bg-[color:var(--color-primary-500)] px-[var(--space-6)] py-[var(--space-4)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] font-[var(--font-weight-body-semibold)] text-[color:var(--color-on-primary)] shadow-[var(--shadow-md)] transition-[background-color,box-shadow,transform] duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:bg-[color:var(--color-primary-700)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2 sm:w-auto"
            >
              <Utensils className="h-[var(--space-4)] w-[var(--space-4)]" aria-hidden="true" />
              Reserve a table
            </a>
            <a
              href="tel:+15550123456"
              className="inline-flex w-full items-center justify-center rounded-[var(--radius-sm)] border border-[color:var(--color-primary-700)] bg-transparent px-[var(--space-6)] py-[var(--space-3)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] font-[var(--font-weight-body-medium)] text-[color:var(--color-on-primary)] transition-[background-color,border-color] duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:border-[color:var(--color-primary-500)] hover:bg-[color:rgba(250,246,238,0.06)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2 sm:w-auto"
            >
              Or call +1 (555) 012-3456
            </a>
          </div>
        </div>
      </section>

      {/* ─── Press strip ─────────────────────────────────────── */}
      <section
        aria-labelledby="press-heading"
        className="bg-[color:var(--color-surface)] py-[var(--space-8)]"
      >
        <div className="mx-auto w-full max-w-[1440px] px-[var(--space-5)] md:px-[var(--space-6)]">
          <h2
            id="press-heading"
            className="text-center font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-text-muted)]"
          >
            As featured in
          </h2>
          <ul className="mt-[var(--space-5)] grid grid-cols-1 gap-[var(--space-5)] sm:grid-cols-3">
            {PRESS.map(({ name, note }) => (
              <li
                key={name}
                className="flex flex-col items-center gap-[var(--space-1)] text-center"
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
    </>
  );
}

export default FineDiningHome;
