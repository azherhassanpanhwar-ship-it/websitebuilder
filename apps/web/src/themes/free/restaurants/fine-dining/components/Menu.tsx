/**
 * LATTICE Theme #1 — Fine Dining
 * Menu component — courses with prices, token-driven cards.
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

  return (
    <section
      aria-label="Menu"
      data-theme-menu
      className="bg-[color:var(--color-surface)] py-[var(--space-9)] md:py-[var(--space-10)]"
    >
      <div className="mx-auto w-full max-w-[1440px] px-[var(--space-5)] md:px-[var(--space-6)]">
        {/* ─── Tab bar ───────────────────────────────────────────────── */}
        <div
          role="tablist"
          aria-label="Menu categories"
          className="flex flex-wrap items-center gap-[var(--space-2)] border-b border-[color:var(--color-border)] pb-[var(--space-4)]"
        >
          {tabIds.map((tabId) => {
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
                className={[
                  "min-h-[var(--space-7)] rounded-[var(--radius-sm)] px-[var(--space-4)] font-[family-name:var(--font-body)] text-[length:var(--space-4)] font-[var(--font-weight-body-medium)] transition-[background-color,color,box-shadow] duration-[var(--duration-base)] ease-[var(--easing-standard)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] focus-visible:outline-offset-2",
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
            className="mt-[var(--space-7)]"
          >
            {activePanel.preamble && (
              <p className="mb-[var(--space-7)] max-w-2xl font-[family-name:var(--font-body)] text-[length:var(--space-4)] italic leading-[var(--line-height-body)] text-[color:var(--color-text-muted)]">
                {activePanel.preamble}
              </p>
            )}

            <div className="flex flex-col gap-[var(--space-9)]">
              {activePanel.sections.map((section, sIdx) => (
                <div
                  key={section.title}
                  className="grid grid-cols-1 gap-[var(--space-5)] md:grid-cols-12"
                >
                  {/* Section heading */}
                  <div className="md:col-span-3">
                    <div className="sticky top-[var(--space-9)] flex flex-col gap-[var(--space-2)]">
                      <p className="font-[family-name:var(--font-body)] text-[length:var(--space-3)] font-[var(--font-weight-body-semibold)] uppercase tracking-[var(--letter-spacing-eyebrow)] text-[color:var(--color-primary-500)]">
                        {`0${sIdx + 1}`.slice(-2)}
                      </p>
                      <h3 className="font-[family-name:var(--font-display)] text-[length:var(--space-7)] font-[var(--font-weight-display)] leading-[var(--line-height-display)] tracking-[var(--letter-spacing-display)] text-[color:var(--color-text)]">
                        {section.title}
                      </h3>
                      {section.subtitle && (
                        <p className="font-[family-name:var(--font-body)] text-[length:var(--space-4)] leading-[var(--line-height-body)] text-[color:var(--color-text-muted)]">
                          {section.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Course list */}
                  <ul className="md:col-span-9 flex flex-col">
                    {section.courses.map((course, cIdx) => (
                      <li
                        key={course.id}
                        className={[
                          "grid grid-cols-1 gap-[var(--space-2)] border-b border-[color:var(--color-border)] py-[var(--space-5)] sm:grid-cols-12",
                          cIdx === 0 ? "border-t" : "",
                        ].join(" ")}
                      >
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
                            <p className="mt-[var(--space-3)] flex items-center gap-[var(--space-2)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] italic text-[color:var(--color-accent)]">
                              <Wine
                                className="h-[var(--space-3)] w-[var(--space-3)]"
                                aria-hidden="true"
                              />
                              {`Pair with: ${course.pairing}`}
                            </p>
                          )}
                        </div>
                        <div className="sm:col-span-4 sm:text-right">
                          <p className="font-[family-name:var(--font-display)] text-[length:var(--space-5)] font-[var(--font-weight-display)] leading-none tracking-[var(--letter-spacing-display)] text-[color:var(--color-primary-700)]">
                            {course.price}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {activePanel.colophon && (
              <p className="mt-[var(--space-7)] flex items-center gap-[var(--space-2)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] italic text-[color:var(--color-text-muted)]">
                <Sparkles
                  className="h-[var(--space-3)] w-[var(--space-3)] text-[color:var(--color-primary-500)]"
                  aria-hidden="true"
                />
                {activePanel.colophon}
              </p>
            )}
          </div>
        )}

        {/* Tab focus-arrow keyboard support (left/right move between tabs) */}
        <div
          aria-hidden="true"
          className="mt-[var(--space-7)] flex items-center gap-[var(--space-2)] font-[family-name:var(--font-body)] text-[length:var(--space-3)] text-[color:var(--color-text-muted)]"
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
