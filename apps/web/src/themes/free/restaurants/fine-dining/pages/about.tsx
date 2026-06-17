/**
 * LATTICE Theme #1 — Fine Dining
 * About page — restaurant story + chef section + values.
 *
 * No Lorem Ipsum. Real fine-dining copy throughout.
 *
 * Layout follows the "Theater of Dining" rhythm:
 *   - Eyebrow ornament (gold hairline + uppercase label)
 *   - Hairline top + bottom frames per section
 *   - Italic display accents on key phrases (the reference's signature)
 */

import * as React from "react";
import { Quote, Leaf, Hand, Wine } from "lucide-react";

const VALUES = [
  {
    icon: Leaf,
    title: "Seasonal first",
    body: "Our menu is set each afternoon from what the markets, the harbour, and our growers brought in that morning. We will not list a dish we cannot source honestly.",
  },
  {
    icon: Hand,
    title: "Made by hand",
    body: "Pasta is pulled each morning. Bread is baked twice daily. Butter is cultured in-house. Nothing on your plate came from a pouch.",
  },
  {
    icon: Wine,
    title: "Small growers",
    body: "We work with forty-three producers, most family-scale. The wine list is built around growers we visit in person, not distributors' catalogues.",
  },
];

const TIMELINE = [
  { year: "1998", note: "Maison Lumière opens on Rue de la Paix with fourteen seats." },
  { year: "2003", note: "First Michelin star. The wine list grows to one hundred bottles." },
  { year: "2009", note: "The dining room expands to thirty-six seats; the hearth is added." },
  { year: "2017", note: "Élise Marchand assumes full ownership; the kitchen doubles in size." },
  { year: "2024", note: "Renewed for a second Michelin star in the city guide." },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-[var(--space-3)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-500)]">
      <span aria-hidden="true" className="block h-px w-8 bg-[color:var(--color-primary-500)]" />
      {children}
    </p>
  );
}

function HairlineFrame({ position }: { position: "top" | "bottom" }) {
  return (
    <div
      aria-hidden="true"
      className={[
        "pointer-events-none absolute inset-x-0 h-px bg-[color:var(--color-border)] opacity-60",
        position === "top" ? "top-0" : "bottom-0",
      ].join(" ")}
    />
  );
}

export function FineDiningAboutPage() {
  return (
    <>
      {/* ─── Page header ─────────────────────────────────────── */}
      <section
        aria-labelledby="about-heading"
        className="relative bg-[color:var(--color-surface)] py-[var(--space-10)] md:py-[var(--space-11)]"
      >
        <HairlineFrame position="top" />
        <div className="mx-auto w-full max-w-[var(--container-max)] px-[var(--margin-mobile)] md:px-[var(--margin-desktop)]">
          <Eyebrow>The House</Eyebrow>
          <h1
            id="about-heading"
            className="mt-[var(--space-4)] max-w-4xl font-[family-name:var(--font-display)] text-[length:clamp(2.5rem,6vw,5rem)] font-[var(--font-weight-display)] leading-[var(--line-height-display)] tracking-[var(--letter-spacing-display)] text-[color:var(--color-text)]"
          >
            Twenty-six years of{" "}
            <em className="italic text-[color:var(--color-primary-500)]">one small dining room.</em>
          </h1>
        </div>
      </section>

      {/* ─── Story ───────────────────────────────────────────── */}
      <section
        aria-labelledby="story-heading"
        className="relative bg-[color:var(--color-surface)] pb-[var(--space-10)] md:pb-[var(--space-11)]"
      >
        <div className="mx-auto grid w-full max-w-[var(--container-max)] grid-cols-1 gap-[var(--space-8)] px-[var(--margin-mobile)] md:grid-cols-12 md:px-[var(--margin-desktop)]">
          <div className="md:col-span-5">
            <h2
              id="story-heading"
              className="font-[family-name:var(--font-display)] text-[length:clamp(2rem,4vw,3.5rem)] font-[var(--font-weight-display)] leading-[var(--line-height-display)] tracking-[var(--letter-spacing-display)] text-[color:var(--color-text)]"
            >
              How we began.
            </h2>
          </div>
          <div className="md:col-span-7 md:pt-[var(--space-2)]">
            <p className="font-[family-name:var(--font-body)] text-[length:var(--space-5)] leading-[var(--line-height-body)] text-[color:var(--color-text)]">
              Maison Lumière opened in the autumn of 1998 in a converted print shop on Rue de la
              Paix. The first menu was twelve lines long, written by hand, and changed every Tuesday
              and Friday. The dining room seated fourteen; the kitchen was the size of a small
              bathroom.
            </p>
            <p className="mt-[var(--space-5)] font-[family-name:var(--font-body)] text-[length:var(--space-5)] leading-[var(--line-height-body)] text-[color:var(--color-text)]">
              Twenty-six years later, the dining room seats thirty-six, the kitchen seats nine, and
              the menu still changes every day. We have added a wine cellar, a private dining room,
              and a chef&apos;s counter. We have not added a second location.
            </p>
            <p className="mt-[var(--space-5)] font-[family-name:var(--font-body)] text-[length:var(--space-5)] leading-[var(--line-height-body)] text-[color:var(--color-text)]">
              The same family has owned the building since 1971. The same family has run the kitchen
              since 1998. We are not a brand.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Chef ────────────────────────────────────────────── */}
      <section
        aria-labelledby="chef-heading"
        className="relative bg-[color:var(--color-surface-alt)] py-[var(--space-10)] md:py-[var(--space-11)]"
      >
        <HairlineFrame position="top" />
        <div className="mx-auto grid w-full max-w-[var(--container-max)] grid-cols-1 items-start gap-[var(--space-8)] px-[var(--margin-mobile)] md:grid-cols-12 md:px-[var(--margin-desktop)]">
          <div className="md:col-span-5">
            <Eyebrow>The Chef</Eyebrow>
            <h2
              id="chef-heading"
              className="mt-[var(--space-4)] font-[family-name:var(--font-display)] text-[length:clamp(2.25rem,4.5vw,4rem)] font-[var(--font-weight-display)] leading-[var(--line-height-display)] tracking-[var(--letter-spacing-display)] text-[color:var(--color-text)]"
            >
              Élise Marchand
            </h2>
            <p className="mt-[var(--space-3)] font-[family-name:var(--font-display)] text-[length:var(--space-4)] italic text-[color:var(--color-primary-300)]">
              Chef &amp; Owner · since 2003 in our kitchen
            </p>
            <dl className="mt-[var(--space-7)] flex flex-col gap-[var(--space-3)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] text-[color:var(--color-text)]">
              <div>
                <dt className="text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-text-muted)]">
                  Trained
                </dt>
                <dd className="mt-[var(--space-1)]">Institut Paul Bocuse, Lyon (1992)</dd>
              </div>
              <div>
                <dt className="text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-text-muted)]">
                  Worked under
                </dt>
                <dd className="mt-[var(--space-1)]">Anne-Sophie Pic, Valence (1994 – 2000)</dd>
              </div>
              <div>
                <dt className="text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-text-muted)]">
                  Joined
                </dt>
                <dd className="mt-[var(--space-1)]">
                  Sous chef, 2003 · Head chef, 2006 · Owner, 2017
                </dd>
              </div>
            </dl>
          </div>
          <div className="md:col-span-7 md:pt-[var(--space-2)]">
            <Quote
              className="h-[var(--space-7)] w-[var(--space-7)] text-[color:var(--color-primary-500)] opacity-80"
              aria-hidden="true"
            />
            <blockquote className="mt-[var(--space-3)] font-[family-name:var(--font-display)] text-[length:clamp(1.5rem,2.5vw,2rem)] font-[var(--font-weight-display-italic)] italic leading-[var(--line-height-subhead)] text-[color:var(--color-text)]">
              &ldquo;I learned the hardest lesson in the kitchen from a chef who never once raised
              her voice: a tasting menu is a series of small decisions, and every one of them has to
              be right. There is no compensating at the end.&rdquo;
            </blockquote>
            <p className="mt-[var(--space-6)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] leading-[var(--line-height-body)] text-[color:var(--color-text)]">
              Élise grew up in Saint-Étienne, the daughter of two schoolteachers. She cooks what she
              was taught to eat: long-simmered meats, bright herbs, the first strawberries of June.
              She does not photograph her food. She does not have a cookbook. She is in the kitchen
              every night the restaurant is open.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Values ──────────────────────────────────────────── */}
      <section
        aria-labelledby="values-heading"
        className="relative bg-[color:var(--color-surface)] py-[var(--space-10)] md:py-[var(--space-11)]"
      >
        <HairlineFrame position="top" />
        <div className="mx-auto w-full max-w-[var(--container-max)] px-[var(--margin-mobile)] md:px-[var(--margin-desktop)]">
          <h2
            id="values-heading"
            className="max-w-3xl font-[family-name:var(--font-display)] text-[length:clamp(2rem,4vw,3.5rem)] font-[var(--font-weight-display)] leading-[var(--line-height-display)] tracking-[var(--letter-spacing-display)] text-[color:var(--color-text)]"
          >
            What we will and will not do.
          </h2>
          <ul className="mt-[var(--space-8)] grid grid-cols-1 gap-[var(--space-6)] md:grid-cols-3">
            {VALUES.map(({ icon: Icon, title, body }) => (
              <li
                key={title}
                className="flex flex-col gap-[var(--space-4)] rounded-[var(--radius-sm)] border border-[color:var(--color-border)] bg-[color:var(--color-surface-card)] p-[var(--space-6)] transition-[border-color,transform] duration-[var(--duration-base)] ease-[var(--easing-standard)] hover:border-[color:var(--color-primary-700)] hover:-translate-y-px"
              >
                <span
                  aria-hidden="true"
                  className="block h-px w-10 bg-[color:var(--color-primary-500)]"
                />
                <Icon
                  className="h-[var(--space-5)] w-[var(--space-5)] text-[color:var(--color-primary-500)]"
                  aria-hidden="true"
                />
                <h3 className="font-[family-name:var(--font-display)] text-[length:var(--space-5)] font-[var(--font-weight-display)] leading-[var(--line-height-subhead)] tracking-[var(--letter-spacing-display)] text-[color:var(--color-text)]">
                  {title}
                </h3>
                <p className="font-[family-name:var(--font-body)] text-[length:var(--space-4)] leading-[var(--line-height-body)] text-[color:var(--color-text-muted)]">
                  {body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── Timeline ────────────────────────────────────────── */}
      <section
        aria-labelledby="timeline-heading"
        className="relative bg-[color:var(--color-surface-alt)] py-[var(--space-10)] md:py-[var(--space-11)]"
      >
        <HairlineFrame position="top" />
        <div className="mx-auto w-full max-w-[var(--container-max)] px-[var(--margin-mobile)] md:px-[var(--margin-desktop)]">
          <Eyebrow>Twenty-six years</Eyebrow>
          <ol className="mt-[var(--space-6)] flex flex-col gap-[var(--space-5)]">
            {TIMELINE.map(({ year, note }) => (
              <li
                key={year}
                className="grid grid-cols-[auto,1fr] items-baseline gap-[var(--space-6)] border-b border-[color:var(--color-border)] pb-[var(--space-4)] last:border-b-0"
              >
                <span className="font-[family-name:var(--font-display)] text-[length:var(--space-6)] font-[var(--font-weight-display)] italic leading-none tracking-[var(--letter-spacing-display)] text-[color:var(--color-primary-500)]">
                  {year}
                </span>
                <p className="font-[family-name:var(--font-body)] text-[length:var(--space-4)] leading-[var(--line-height-body)] text-[color:var(--color-text)]">
                  {note}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}

export default FineDiningAboutPage;
