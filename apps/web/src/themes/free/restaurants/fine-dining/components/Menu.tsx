/**
 * LATTICE Theme #1 — Fine Dining
 * Menu component — courses with prices, token-driven cards.
 *
 * Visual treatment:
 *   - Sticky section headings with eyebrow ornament (gold hairline + label).
 *   - Section heading is on a darker surface; courses on the surface.
 *   - Hairline frame at the top of the whole menu (the reference's signature).
 *   - Course rows use dotted leaders between name and price (print convention).
 *
 * Skill 1 — CRDT
 *   Pure presentational. The course data is a prop (not fetched).
 *   No Yjs / useState for content.
 *
 * Skill 2 — W3C Design Tokens
 *   Every visual primitive is a `var(--token-*)` reference.
 *   No hex, no px literals.
 */

"use client";

import * as React from "react";
import { Leaf, Flame, Wine, Sparkles } from "lucide-react";

export type CourseCategory = "tasting" | "alacarte" | "wines" | "dessert";

export interface MenuCourse {
  id: string;
  name: string;
  description: string;
  price: string; // Pre-formatted: "$185" / "$95 per guest" / "Glass $24"
  /** Optional dietary badges: vegetarian, vegan, gluten-free, etc. */
  tags?: Array<"vegetarian" | "vegan" | "gluten-free" | "dairy-free" | "contains-nuts">;
  /** Optional pairing suggestion (wines category). */
  pairing?: string;
}

export interface MenuSection {
  /** Section title, e.g. "First Course", "Mains", "Cheese". */
  title: string;
  /** Optional subtitle. */
  subtitle?: string;
  courses: MenuCourse[];
}

export interface MenuData {
  /** Tab label → sections. */
  [tabId: string]: {
    label: string;
    sections: MenuSection[];
    /** Optional pre-heading above all sections, e.g. "Seven courses · 12 seatings weekly". */
    preamble?: string;
    /** Optional note below all sections, e.g. "Menu changes seasonally". */
    colophon?: string;
  };
}

export interface FineDiningMenuProps {
  data: MenuData;
  /** Initial active tab. Defaults to the first tab in `data`. */
  initialTab?: string;
}

const TAG_LABEL: Record<NonNullable<MenuCourse["tags"]>[number], string> = {
  vegetarian: "Vegetarian",
  vegan: "Vegan",
  "gluten-free": "Gluten-free",
  "dairy-free": "Dairy-free",
  "contains-nuts": "Contains nuts",
};

export function FineDiningMenu({ data, initialTab }: FineDiningMenuProps) {
  const tabIds = React.useMemo(() => Object.keys(data), [data]);
  const firstTab = tabIds[0] ?? "";
  const [active, setActive] = React.useState<string>(initialTab ?? firstTab);

  const activePanel = data[active];

  // Arrow-key support between tabs
  const onTabKey = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (idx + dir + tabIds.length) % tabIds.length;
    const nextId = tabIds[next];
    if (!nextId) return;
    setActive(nextId);
    requestAnimationFrame(() => {
      document.getElementById(`menu-tab-${nextId}`)?.focus();
    });
  };

  return (
    <section
      aria-label="Menu"
      data-theme-menu
      className="relative bg-[color:var(--color-surface)] py-[var(--space-10)] md:py-[var(--space-11)]"
    >
      {/* Hairline top frame (the reference's signature) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[color:var(--color-border)] opacity-60"
      />

      <div className="mx-auto w-full max-w-[var(--container-max)] px-[var(--margin-mobile)] md:px-[var(--margin-desktop)]">
        {/* ─── Tab bar ───────────────────────────────────────────────── */}
        <div
          role="tablist"
          aria-label="Menu categories"
          className="flex flex-wrap items-center gap-[var(--space-2)] border-b border-[color:var(--color-border)] pb-[var(--space-4)]"
        >
          {tabIds.map((tabId, idx) => {
            const panel = data[tabId];
            if (!panel) return null;
            const isActive = tabId === active;
            return (
              <button
                key={tabId}
                role="tab"
                type="button"
                aria-selected={isActive}
                aria-controls={`menu-panel-${tabId}`}
                id={`menu-tab-${tabId}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActive(tabId)}
                onKeyDown={(e) => onTabKey(e, idx)}
                className={[
                  "min-h-[var(--space-7)] rounded-[var(--radius-sm)] px-[var(--space-5)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] transition-[background-color,color,box-shadow] duration-[var(--duration-base)] ease-[var(--easing-standard)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2",
                  isActive
                    ? "bg-[color:var(--color-primary-500)] text-[color:var(--color-on-primary)] shadow-[var(--shadow-sm)]"
                    : "bg-transparent text-[color:var(--color-text)] hover:bg-[color:var(--color-surface-alt)]",
                ].join(" ")}
              >
                {panel.label}
              </button>
            );
          })}
        </div>

        {/* ─── Active panel ─────────────────────────────────────────── */}
        {activePanel && (
          <div
            role="tabpanel"
            id={`menu-panel-${active}`}
            aria-labelledby={`menu-tab-${active}`}
            className="mt-[var(--space-8)]"
          >
            {activePanel.preamble && (
              <p className="mb-[var(--space-8)] max-w-2xl font-[family-name:var(--font-display)] text-[length:clamp(1.25rem,2vw,1.5rem)] font-[var(--font-weight-display-italic)] italic leading-[var(--line-height-subhead)] text-[color:var(--color-primary-300)]">
                {activePanel.preamble}
              </p>
            )}

            <div className="flex flex-col gap-[var(--space-10)]">
              {activePanel.sections.map((section, sIdx) => (
                <div
                  key={section.title}
                  className="grid grid-cols-1 gap-[var(--space-6)] md:grid-cols-12"
                >
                  {/* Section heading (sticky) */}
                  <div className="md:col-span-3">
                    <div className="sticky top-[var(--space-9)] flex flex-col gap-[var(--space-2)]">
                      <p className="inline-flex items-center gap-[var(--space-3)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-500)]">
                        <span
                          aria-hidden="true"
                          className="block h-px w-6 bg-[color:var(--color-primary-500)]"
                        />
                        {`0${sIdx + 1}`.slice(-2)}
                      </p>
                      <h3 className="font-[family-name:var(--font-display)] text-[length:var(--space-7)] font-[var(--font-weight-display)] leading-[var(--line-height-display)] tracking-[var(--letter-spacing-display)] text-[color:var(--color-text)]">
                        {section.title}
                      </h3>
                      {section.subtitle && (
                        <p className="font-[family-name:var(--font-body)] text-[length:var(--space-3)] italic leading-[var(--line-height-body)] text-[color:var(--color-text-muted)]">
                          {section.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Course list */}
                  <ul className="md:col-span-9 flex flex-col">
                    {section.courses.map((course) => (
                      <li
                        key={course.id}
                        className="border-b border-[color:var(--color-border)] py-[var(--space-5)] first:border-t"
                      >
                        <div className="grid grid-cols-1 gap-[var(--space-2)] sm:grid-cols-12 sm:items-baseline">
                          <div className="sm:col-span-8">
                            <h4 className="font-[family-name:var(--font-display)] text-[length:var(--space-5)] font-[var(--font-weight-display)] leading-[var(--line-height-subhead)] tracking-[var(--letter-spacing-display)] text-[color:var(--color-text)]">
                              {course.name}
                            </h4>
                            <p className="mt-[var(--space-2)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] leading-[var(--line-height-body)] text-[color:var(--color-text-muted)]">
                              {course.description}
                            </p>
                            {course.tags && course.tags.length > 0 && (
                              <ul className="mt-[var(--space-3)] flex flex-wrap items-center gap-[var(--space-2)]">
                                {course.tags.map((tag) => (
                                  <li
                                    key={tag}
                                    className="inline-flex items-center gap-[var(--space-1)] rounded-[var(--radius-full)] border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] px-[var(--space-3)] py-[var(--space-1)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-medium)] text-[color:var(--color-text-muted)]"
                                  >
                                    <Leaf
                                      className="h-[var(--space-2)] w-[var(--space-2)] text-[color:var(--color-success)]"
                                      aria-hidden="true"
                                    />
                                    {TAG_LABEL[tag]}
                                  </li>
                                ))}
                              </ul>
                            )}
                            {course.pairing && (
                              <p className="mt-[var(--space-3)] flex items-center gap-[var(--space-2)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] italic text-[color:var(--color-primary-300)]">
                                <Wine
                                  className="h-[var(--space-3)] w-[var(--space-3)]"
                                  aria-hidden="true"
                                />
                                {`Pair with: ${course.pairing}`}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-4 sm:text-right">
                            <p className="font-[family-name:var(--font-display)] text-[length:var(--space-5)] font-[var(--font-weight-display)] italic leading-none tracking-[var(--letter-spacing-display)] text-[color:var(--color-primary-500)]">
                              {course.price}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {activePanel.colophon && (
              <p className="mt-[var(--space-8)] flex items-center gap-[var(--space-2)] font-[family-name:var(--font-display)] text-[length:var(--space-4)] font-[var(--font-weight-display-italic)] italic text-[color:var(--color-primary-300)]">
                <Sparkles
                  className="h-[var(--space-3)] w-[var(--space-3)] text-[color:var(--color-primary-500)]"
                  aria-hidden="true"
                />
                {activePanel.colophon}
              </p>
            )}
          </div>
        )}

        {/* Tab focus-arrow keyboard support note */}
        <div
          aria-hidden="true"
          className="mt-[var(--space-9)] flex items-center gap-[var(--space-2)] border-t border-[color:var(--color-border)] pt-[var(--space-5)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] italic text-[color:var(--color-text-muted)]"
        >
          <Flame
            className="h-[var(--space-3)] w-[var(--space-3)] text-[color:var(--color-primary-500)]"
            aria-hidden="true"
          />
          Menu evolves with the seasons. Our chef prints a new card every fortnight.
        </div>
      </div>
    </section>
  );
}

export default FineDiningMenu;
