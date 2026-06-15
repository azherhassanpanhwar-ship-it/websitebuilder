# LATTICE v3.1 — GOD MODE ENGINEERING CONTEXT

> **Spec version:** v3.1 (supersedes v3.0 — adds Skill 5: Asset & Typography Pipeline, Design Laws 11–15, Pexels/Context7/Playwright MCPs, Step E visual QA loop)
> **Implementation plan:** `docs/LATTICE_Implementation_Plan_v3_0.md` (204 tasks · 18 months · $78M · full budget · risk register)
> **Total scope:** 204 tasks · 18 months · $78M · 90-person peak team
> **Current focus:** Phase 1 & 2 — Document Substrate + Theme Engine Foundation

---

## 0. Pre-Flight: Tool & MCP Installation Checklist

> Run this once before starting Phase 3 theme work. Without these, themes default to placeholder gray boxes, system fonts, and a Lighthouse-only QA loop that can't catch "looks cheap."

| Tool                           | Priority                          | Purpose                                                                                 | Install                                                                                                                 |
| ------------------------------ | --------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Pexels MCP**                 | Required                          | Primary real-photo source for hero/section images — Design Law 11                       | `claude mcp add pexels -e PEXELS_API_KEY=your_key -- npx -y mcp-pexels` (free key, instant: pexels.com/api, 200 req/hr) |
| **Playwright MCP**             | Required — replaces Puppeteer MCP | Lighthouse + axe-core + multi-viewport screenshots for Steps D & E                      | `claude mcp add playwright -- npx @playwright/mcp@latest`                                                               |
| **Context7 MCP**               | Recommended                       | Live, version-specific Next.js / Tailwind / Yjs / Stripe docs — stops hallucinated APIs | `claude mcp add context7 -- npx -y @upstash/context7-mcp@latest`                                                        |
| **lucide-react** (npm package) | Required                          | Single icon system across all 62 themes — Skill 5                                       | `npm install lucide-react`                                                                                              |
| **Unsplash MCP**               | Optional / Phase 2                | Supplemental images only if Pexels lacks coverage for a niche category                  | Community-maintained — search "unsplash mcp server", verify current README before install                               |
| GitHub / Figma / Supabase MCP  | Already specified                 | No change                                                                               | See Section 5                                                                                                           |

**Two corrections to prior research:**

- `@anthropic-ai/mcp-server-unsplash` does not exist — Anthropic doesn't publish an Unsplash MCP. Pexels MCP above is simpler, has 4x the rate limit, and needs no app-review process.
- `next/font` is **already built into Next.js 13+**. Do not `npm install @next/font` — that package is deprecated and will conflict. See Design Law 12.

---

## 1. Mission

We are building **LATTICE**, a next-generation visual website builder (Shopify + Wix competitor).

**GA target:** 62 first-party free themes in 13 categories, 500 themes by GA+12mo, LATTICE Pay, multiplayer editing, agentic commerce, WCAG 2.2 AA, Lighthouse 95+ mandatory.

---

## 2. The 8 Pillars (NEVER VIOLATE)

| #   | Pillar                         | Hard constraint                                              |
| --- | ------------------------------ | ------------------------------------------------------------ |
| 0   | **Performance is the product** | Lighthouse 95+ p50 — measured, not aspirational              |
| 1   | **Typed document substrate**   | Everything is a Yjs CRDT — no exceptions                     |
| 2   | **Parity-rendered editor**     | Canvas/DOM must match publish output exactly                 |
| 3   | **Tokens + peer-AI**           | W3C Design Tokens drive all themes; AI is a first-class peer |
| 4   | **Commerce + open checkout**   | Headless commerce; Stripe logic never touches Yjs layer      |
| 5   | **Compliance**                 | WCAG 2.2 AA, strict TypeScript, SOC 2, GDPR, PCI v4.0.1      |
| 6   | **Open-core + marketplace**    | MIT runtime in P6; theme + app + function marketplace        |
| 7   | **THEMES**                     | 62 free at GA · 100 premium · 338 partner = 500 by Year 1    |

---

## 3. Architecture Skills (ENFORCE ALWAYS)

### Skill 1 — CRDT Architecture (Yjs)

LATTICE is a multiplayer editor. All persistent data **must** live in Yjs shared types.

- **NEVER** use `useState` or `useReducer` for persistent document/theme/block data.
- Use `Y.Map`, `Y.Array`, `Y.Text`, or other Yjs shared types for all persistent state.
- Ephemeral UI state only (hover, focus, loading spinners) may use React state.
- All sync goes through the Yjs provider layer (`y-websocket` / `y-webrtc`).
- Block registry, theme settings, and site tree are all Yjs documents.

### Skill 2 — W3C Design Tokens

The 500-Theme engine is entirely token-driven.

- **NEVER** hardcode hex colors, font sizes, spacing values, or any visual primitive.
- Always output CSS custom properties mapped to the W3C token schema.
- Token naming: `--token-category-variant` (e.g. `--color-primary-500`, `--font-size-body-md`, `--spacing-layout-gap`).
- Token values resolve at theme level; components consume variables only.
- Theme Generator produces `{ palette, typography, spacing, density, radius, shadow, hero, header, footer, animation }` — all as token overrides, never hardcoded values.

### Skill 3 — Zod Schema Validation

Every API boundary and Theme Setting requires a Zod schema.

- **NEVER** use `any`, raw `JSON.parse()`, or unvalidated external data.
- All API request payloads must have a `z.object()` schema before use.
- All API responses must be parsed and validated before consumption.
- Theme settings objects must have a Zod schema co-located with the type definition.
- Prefer `schema.safeParse()` for graceful error handling at boundaries.
- TypeScript types are **inferred** from Zod schemas — never defined separately.

### Skill 4 — Headless Commerce

Payments and carts are decoupled from the visual editor.

- **NEVER** couple Stripe logic, cart state, or order management into the Yjs document layer.
- Commerce logic lives in `src/commerce/` — a separate module boundary.
- Editor ↔ Commerce communication happens via typed hooks or API calls only — no direct state sharing.
- Stripe webhooks and payment intents are server-side only.
- Cart state is ephemeral — managed outside any CRDT/Yjs document.
- LATTICE Pay (1-click checkout, P5) follows the same boundary.

---

## 4. Strict Coding Rules

- **TypeScript:** Strict mode on. Zero `any` types. All interfaces defined in `src/types/`.
- **CRDTs:** `yjs` library for all document state. No exceptions (see Skill 1).
- **Styling:** Tailwind + W3C Design Tokens (CSS Variables). Never hardcode hex values (see Skill 2).
- **Validation:** Zod for all API and Theme schemas (see Skill 3).
- **Commerce:** Headless — Stripe never touches Yjs layer (see Skill 4).
- **Output:** Write ONLY the code and brief explanations. No filler text.
- **Commits:** Conventional commits — `feat(theme): ...`, `fix(editor): ...`, `chore(infra): ...`

---

## 5. Agentic Tool Usage (MCPs)

**GitHub MCP:** After completing any task (e.g., Task 1.17), auto-commit with a conventional commit message (`feat(theme): implement zod schema for theme settings`), then open a PR.

**Playwright MCP:** After creating or modifying a theme, launch the dev server, run Lighthouse, and report the score. If score < 95, autonomously refactor until it passes. Also runs axe-core accessibility checks and multi-viewport screenshots.

**Figma MCP:** Claude Code is the Lead Designer (see Section 6.5). Figma is a secondary viewer/export target only. If a human-created Figma file exists, read it for structural reference — but never wait for Figma before designing. The W3C Token JSON in `src/tokens/` is always the source of truth.

**Supabase MCP:** Use for querying users, installed themes, and site metadata. Never write raw SQL without schema validation.

---

## 6. Theme Engine Architecture

### A LATTICE theme consists of:

- **Theme Document** — full site tree (home + 4–7 inner pages)
- **Theme Settings** — `{ color, typography, spacing, hero, header, footer, animations }` (all token references)
- **3 Presets per theme** — Bold / Minimal / Warm (or category-appropriate variation)
- **Theme Assets Bundle** — logo, hero image, supporting images, icon set (all licensed)
- **Theme Metadata** — `{ category, subcategory, tags, target_industry, design_style, color_mood, screenshot }`
- **Theme Description** — markdown for the marketplace listing

### Theme Generator parameters (all produce token overrides, never hardcoded values):

`palette` · `typography_pairing` · `spacing_scale` · `layout_density` · `corner_radius` · `shadow_style` · `hero_pattern` · `header_style` · `footer_style` · `animation_style` · `content_type`

### Theme schema location:

`src/engine/theme/ThemeSchema.ts` — Zod schema + inferred TypeScript types

### Theme quality bar (every theme must pass before merge):

1. Complete site — home + 4–7 inner pages
2. 3 presets (Bold / Minimal / Warm)
3. Lighthouse 95+ p50
4. WCAG 2.2 AA (axe-core in CI)
5. Fully responsive (base + sm + md + lg + custom breakpoints)
6. Real content (no Lorem Ipsum)
7. SEO-ready (semantic HTML, JSON-LD, meta tags)
8. E-commerce-ready if applicable
9. Theme settings wired to tokens
10. 1-page documentation (setup + customization)
11. Asset bundle present
12. Marketplace description written

---

## 6.5 Skill 5 — AI as Lead Theme Designer (God Mode Design System)

> **Claude Code is the Lead Designer for all 62 first-party free themes.**
> We do not wait for Figma files. Design is generated programmatically from first principles.
> **Source of truth:** `src/tokens/` (W3C Token JSON) → code → browser. Figma is a viewer, never the source.

---

### The God Mode Design Workflow (5-Step Loop)

When tasked to design any theme, execute this exact sequence autonomously:

```
Step A → Generate tokens.json       (design decisions as W3C token data)
Step B → Generate tailwind config    (token → Tailwind alias mapping)
Step C → Generate React components   (Hero, Header, Footer, inner pages)
Step D → Playwright MCP → Lighthouse (render, score, auto-fix if <95)
Step E → Playwright MCP → Visual QA  (multi-viewport screenshots, axe-core, confirm no regressions)
```

**Never skip a step. Never hardcode a value in Step C that wasn't declared in Step A.**

---

### Design Law 1 — Color Psychology by Category

Apply these color systems precisely. These are not suggestions — they are the brand contract for each industry.

| Category                                  | Psychology goal                    | Primary palette                             | Accent                               | Avoid                       |
| ----------------------------------------- | ---------------------------------- | ------------------------------------------- | ------------------------------------ | --------------------------- |
| **Restaurants / Fine Dining**             | Appetite, warmth, desire           | Warm neutrals (cream `#F5F0E8`, warm white) | Deep gold `#C9A84C`, burgundy        | Cold blues, stark white     |
| **Restaurants / Casual & Fast**           | Energy, approachability            | Earth tones (terracotta, sage, brown)       | Warm amber                           | Pastels, corporate grey     |
| **Restaurants / Bar & Brewery**           | Sophistication, night-time mood    | Dark charcoal `#1A1A1A`, near-black         | Amber `#D4830A`, gold                | Bright primaries, white bg  |
| **Restaurants / Bakery & Dessert**        | Softness, sweetness, delight       | Soft pinks `#F2D4D7`, cream `#FAF6F0`       | Warm brown `#8B5E3C`                 | Harsh contrast, neon        |
| **Hospitality / Boutique Hotel**          | Luxury, trust, exclusivity         | Deep navy `#0D1B2A`, cream `#F7F3EC`        | Brushed gold `#B8975A`               | Cheap brights, flat colours |
| **Hospitality / Resort**                  | Freedom, escape, joy               | Turquoise `#2CBFBF`, sand `#E8D5B7`         | Coral `#FF6B6B`                      | Corporate, dark backgrounds |
| **E-commerce / Fashion**                  | Aspiration, edge, status           | Pure black `#0A0A0A`, pure white `#FAFAFA`  | Single accent (varies per theme)     | Rainbow palettes            |
| **E-commerce / Jewelry**                  | Luxury, precision, desire          | Cream `#FAF8F4`, warm off-white             | Champagne gold `#D4AF70`, black      | Pastels, colourful          |
| **E-commerce / Tech / Electronics**       | Power, precision, speed            | Near-black `#111111`, white                 | Electric accent (`#0066FF` or brand) | Warm tones, handwritten     |
| **E-commerce / Sports & Fitness**         | Energy, performance, dominance     | Black `#0D0D0D`, white                      | Neon green `#39FF14` or electric     | Muted, warm, cozy           |
| **Portfolio / Creative**                  | Individuality, craft, intelligence | Black + white base                          | Single expressive accent             | Generic, corporate blues    |
| **Portfolio / Photographer**              | Drama, silence, focus              | Black `#0A0A0A`, white `#FFFFFF`            | Warm sepia `#C8A97E`                 | Colourful, noisy            |
| **Professional Services / Law & Finance** | Trust, authority, stability        | Navy `#1B2A4A`, cream `#F6F3EE`             | Deep gold `#A87C3E`                  | Bright, playful             |
| **Professional Services / Agency**        | Creativity within control          | Black or deep indigo                        | Bold gradient or neon accent         | Clipart-generic             |
| **Health / Medical & Dental**             | Calm, cleanliness, safety          | Soft blue `#E8F4FD`, white `#FFFFFF`        | Sage green `#7BAF9E`                 | Red, dark, aggressive       |
| **Health / Yoga & Therapy**               | Peace, healing, groundedness       | Warm sage `#A8B5A2`, cream `#F9F5EE`        | Dusty rose `#D4A9A9`                 | Neon, high contrast, dark   |
| **Beauty / Salon & Spa**                  | Elegance, self-care, luxury        | Black + cream or blush `#F2D4C8`            | Rose gold `#C9907A` or gold          | Cheap brights               |
| **Education**                             | Trust, optimism, clarity           | Navy `#1B2A4A`, white                       | Warm gold or teal accent             | Loud, aggressive            |
| **Nonprofit & Community**                 | Hope, warmth, humanity             | Warm cream or soft teal                     | Amber or coral                       | Cold, corporate             |
| **Events / Wedding**                      | Romance, elegance, emotion         | Soft blush `#F5E6E0`, cream, champagne      | Soft gold, sage                      | Stark black, neon           |
| **Events / Conference**                   | Authority, scale, energy           | Black or deep blue                          | Bold brand accent                    | Pastel, soft                |
| **Tech / SaaS**                           | Innovation, speed, intelligence    | Dark `#0D0D0D` or deep navy                 | Gradient (indigo→violet, blue→cyan)  | Warm, cozy, traditional     |
| **Tech / Developer Tool**                 | Craft, precision, hackers          | Near-black `#111111`                        | Neon green `#00FF7F` or cyan         | Colourful, photographic     |
| **Blog / Magazine**                       | Readability, curation, depth       | Cream or white bg                           | Black typography + 1 accent          | Low contrast                |
| **Construction & Trades**                 | Strength, reliability, action      | Navy `#1C2D45` or slate                     | Safety orange `#E8670A` or red       | Pastels, fine dining feel   |

---

### Design Law 2 — Typography Pairing Matrix

**NEVER mix more than 2 type families. NEVER use a system font for hero text.**

| Mood / Industry                               | Display (headings)                       | Body                      | Notes                                                       |
| --------------------------------------------- | ---------------------------------------- | ------------------------- | ----------------------------------------------------------- |
| **Luxury / Fine Dining / Hotels / Jewelry**   | Cormorant Garamond, Playfair Display     | Inter, DM Sans            | Serif display → serif/sans body. Max tracking on headlines. |
| **Modern / Tech / SaaS / Startup**            | Space Grotesk, Neue Haas Unica, DM Sans  | Inter, IBM Plex Sans      | All-sans. Weight contrast does the work.                    |
| **Editorial / Magazine / Blog**               | Lora, Libre Baskerville                  | Inter or Source Serif Pro | Serif display, clean body.                                  |
| **Friendly / Bakery / Community / Nonprofit** | Plus Jakarta Sans, Nunito                | Nunito Sans, DM Sans      | Rounded, warm sans. Never all-caps.                         |
| **Bold / Sports / Events / Construction**     | Barlow Condensed Bold, Oswald            | Barlow, DM Sans           | Extended tracking on display, tight body.                   |
| **Creative / Portfolio / Illustration**       | Fragment Mono, Syne, Space Grotesk       | DM Sans, IBM Plex Sans    | One expressive font, one workhorse.                         |
| **Professional / Legal / Finance**            | Playfair Display, EB Garamond            | Inter, DM Sans            | Classic serif signals authority.                            |
| **Wellness / Therapy / Yoga**                 | Cormorant Light, Libre Baskerville Light | DM Serif Text, Karla      | Lightweight, airy, wide tracking.                           |
| **Playful / Kids / Dessert / Toys**           | Nunito ExtraBold, Fredoka One            | Nunito, Plus Jakarta Sans | Round letterforms. High x-height.                           |
| **Cinematic / Photography / Film**            | Cormorant Infant, IM Fell English        | Inter Light               | Italic serif display. Body recedes.                         |

**Rules:**

- Display font: load only weights actually used (300, 400, 700 max)
- Body font: use `font-display: swap` always
- Line-height for body: `1.6–1.75` — never below `1.5`
- Heading scale: use a modular scale (1.25 or 1.333 ratio), never arbitrary px

---

### Design Law 3 — Visual Hierarchy & Spacing System

Use an **8px base grid**. All spacing values must be multiples of 4 or 8.

```
--space-1:  4px   (micro gaps, icon padding)
--space-2:  8px   (tight component gaps)
--space-3:  12px
--space-4:  16px  (base unit — default padding)
--space-5:  24px
--space-6:  32px  (section sub-gaps)
--space-7:  48px
--space-8:  64px  (section padding mobile)
--space-9:  96px  (section padding desktop)
--space-10: 128px (hero vertical rhythm)
--space-11: 160px (XL hero padding)
```

**Layout density mapping:**

- `compact` → use `--space-4` through `--space-7`
- `comfortable` → use `--space-5` through `--space-9` (default)
- `spacious` → use `--space-7` through `--space-11` (luxury/editorial)

Luxury and wellness themes should always default to `spacious`. SaaS/Tech: `comfortable`. Food/Retail: `compact` or `comfortable`.

---

### Design Law 4 — Hero Patterns (implementation rules)

| Pattern                | When to use                                 | Implementation rule                                                                                     |
| ---------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `full-bleed-image`     | Restaurants, Hotels, Portfolio, Photography | Image fills 100vw × 100vh. Overlay gradient from bottom. Text bottom-left. Never center-crop on mobile. |
| `split-image-text`     | Casual dining, Real Estate, Consulting      | 50/50 or 60/40 grid. Image right on desktop, stacked on mobile. Text has strong vertical centering.     |
| `centered-text-image`  | Coffee shops, B&Bs, Tutors, Wellness        | Max-width container. Image below or behind text (subtle). Text is the hero.                             |
| `gallery-grid`         | Bakery, Vacation Rental, Art Prints         | CSS grid 3-col desktop, 2-col tablet, 1-col mobile. Masonry optional.                                   |
| `animated-interactive` | Web Designer, SaaS, Developer Tools         | GSAP or CSS keyframes. Never block paint. Run animation after `onLoad`.                                 |
| `video-background`     | Resort, Videographer, Live Events           | Muted autoplay. Always `<video poster>` fallback. Lazy-load if below fold.                              |
| `device-mockup`        | Mobile App, SaaS dashboard                  | CSS 3D transform on device frame. Real screenshot inside.                                               |
| `dark-moody`           | Bar/Brewery, Musician, Fine Dining dark     | 90%+ dark background. Single bright focal point. Grain texture overlay at 3-5% opacity.                 |
| `minimal-text`         | Food Truck, Architecture, Law Firm modern   | Full white/off-white. Large display type. Zero imagery in hero.                                         |
| `illustrated`          | Ice Cream, Kids, Community                  | SVG illustrations. Playful, branded, token-colored. Never stock photos in illustrated themes.           |

---

### Design Law 5 — Component-Level Design Rules

These rules apply to every component in every theme.

**Buttons:**

- Primary: `background: var(--color-primary)` · `color: var(--color-on-primary)` · `border-radius: var(--radius-button)`
- Hover: lighten 10% OR add `box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.35)`
- Never use gradient backgrounds on buttons unless the theme is explicitly `Tech/SaaS gradient`
- Min tap target: 44×44px (WCAG 2.5.5)

**Cards:**

- `border-radius: var(--radius-card)` (sharp=0, soft=8px, round=16px)
- `box-shadow: var(--shadow-card)` — subtle only unless `--shadow-style: pronounced`
- Image inside card: `object-fit: cover` always · `aspect-ratio: 4/3` default (override per category)
- Hover: `transform: translateY(-2px)` + shadow deepening — never border flash

**Navigation:**

- Sticky header: `backdrop-filter: blur(12px)` + `background: rgba(var(--color-surface-rgb), 0.85)`
- Transparent header (for full-bleed heroes): starts transparent, transitions to solid on scroll
- Mobile: hamburger at ≤768px · drawer slides from right · always has close button + trap focus
- Active link: `color: var(--color-primary)` + optional underline accent

**Footer:**

- `compact`: single row — logo + nav + copyright
- `expanded`: 3-4 column grid — logo+tagline / nav / contact / social
- `multi-column`: newsletter + links + legal — for SaaS/Tech/Ecommerce
- Background: always `var(--color-surface-dark)` or `var(--color-inverse)` — never same as body

**Forms:**

- Input border: `1px solid var(--color-border)` → focus: `2px solid var(--color-primary)` (no `outline: none` ever)
- Error state: `border-color: var(--color-error)` + helper text below in `var(--color-error)`
- Label always above the field — never placeholder-as-label
- Submit button: full-width on mobile

---

### Design Law 6 — Animation & Motion Rules

```
--duration-fast:    150ms   (micro feedback: button press, checkbox)
--duration-base:    250ms   (standard transitions: hover, focus)
--duration-enter:   400ms   (elements entering viewport)
--duration-page:    600ms   (page-level transitions)
--easing-standard:  cubic-bezier(0.4, 0, 0.2, 1)   (material standard)
--easing-decelerate:cubic-bezier(0, 0, 0.2, 1)     (elements entering)
--easing-accelerate:cubic-bezier(0.4, 0, 1, 1)     (elements exiting)
--easing-spring:    cubic-bezier(0.34, 1.56, 0.64, 1) (playful bounce)
```

**Animation style mapping:**

- `none`: zero motion — use for accessibility-first themes (medical, therapy, education)
- `subtle`: fade-in + translateY(8px) on scroll-enter only. No continuous loops.
- `bold`: stagger animations, scale effects, GSAP scroll-driven. Only for Tech/SaaS/Creative.

**ALWAYS** respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

### Design Law 7 — Corner Radius System

```
--radius-xs:     2px   (badges, tags, chips)
--radius-sm:     4px   (inputs, small buttons)
--radius-md:     8px   (cards, buttons — default)
--radius-lg:     12px  (modals, panels)
--radius-xl:     16px  (hero images, large cards)
--radius-2xl:    24px  (full soft — wellness, friendly)
--radius-full:   9999px (pills, avatars, toggles)
```

**Corner radius by category:**

- `sharp` (0–2px): Law firms, Architecture, Fine Dining dark, Editorial
- `soft` (8–12px): Most categories — safe universal default
- `round` (16–24px): Bakery, Wellness, Kids, Community, Ice cream

---

### Design Law 8 — Shadow System

```
--shadow-none:       none
--shadow-xs:         0 1px 2px rgba(0,0,0,0.05)
--shadow-sm:         0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)
--shadow-md:         0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)
--shadow-lg:         0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)
--shadow-xl:         0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)
--shadow-colored:    0 8px 24px rgba(var(--color-primary-rgb), 0.25)
--shadow-inner:      inset 0 2px 4px rgba(0,0,0,0.06)
```

**Shadow style mapping:**

- `none`: flat design (Editorial, Magazine, minimal SaaS)
- `subtle`: `--shadow-xs` to `--shadow-md` — default for most
- `pronounced`: `--shadow-lg`, `--shadow-xl` — use for cards in Ecommerce, hotels, food

---

### Design Law 9 — Responsive Breakpoint Contract

```
base:    0px       (mobile-first, single column)
sm:      640px     (tablet portrait — 2 col grids unlock)
md:      768px     (tablet landscape — nav changes, side-by-side)
lg:      1024px    (desktop — full layouts)
xl:      1280px    (wide desktop — max-width container)
2xl:     1536px    (ultra-wide — cap at 1440px max-content-width)
```

**Rules:**

- Max content width: `1440px` centered — never let text span 100vw at `2xl`
- Font size scaling: use `clamp()` for hero display text — e.g., `clamp(2.5rem, 5vw, 5rem)`
- Images: always `srcset` with 3 sizes minimum (400w, 800w, 1200w)
- Never show desktop nav on mobile — hamburger threshold at `md`

---

### Design Law 10 — Quality Self-Check (run before Step D / Playwright)

Before calling Playwright, mentally verify:

| Check                                                   | Pass condition                      |
| ------------------------------------------------------- | ----------------------------------- |
| Zero hardcoded hex values                               | All colors are `var(--color-*)`     |
| Zero hardcoded px for spacing in components             | All spacing is `var(--space-*)`     |
| Font loaded via `next/font` or `@font-face` with `swap` | Yes                                 |
| `prefers-reduced-motion` block present                  | Yes                                 |
| All interactive elements have `:focus-visible` ring     | Yes, uses `var(--color-focus-ring)` |
| Images have `alt` text                                  | Yes, descriptive (not "image1")     |
| Color contrast ratio for body text                      | ≥ 4.5:1 (AA)                        |
| Color contrast ratio for large text                     | ≥ 3:1                               |
| Min tap target 44×44px                                  | All buttons and links               |
| No `Lorem Ipsum` in any content                         | Real sample copy used               |
| Hero image has `loading="eager"`                        | Yes (it is LCP element)             |
| Below-fold images have `loading="lazy"`                 | Yes                                 |

---

### Theme Design Command Reference

When you receive a theme task, the command structure is:

```
"Read CLAUDE.md Section 6.5. Execute theme design for [THEME NAME].
Category: [X]. Subcategory: [Y]. Hero: [pattern]. Color mood: [Z].
Step A → B → C → D → E. Commit with feat(theme): design [theme-name] tokens and components."
```

**Example (Task 3.34, Theme #1):**

```
"Read CLAUDE.md Section 6.5. Execute Task 3.34 Theme #1: Fine Dining.
Category: Restaurants. Hero: full-bleed-image. Color: warm neutrals + gold.
Step A: Generate src/themes/free/restaurants/fine-dining/tokens.json
Step B: Generate tailwind.fine-dining.config.ts
Step C: Generate Hero, Header, Footer, Menu, Reservation, About, Contact pages
Step D: Playwright → Lighthouse 95+.
Step E: Playwright → Visual QA screenshots + axe-core.
Commit feat(theme): design fine-dining complete."
```

---

### File Structure for Every Theme

```
src/themes/free/[category]/[theme-slug]/
├── tokens.json              ← W3C Design Token JSON (Step A output)
├── tailwind.config.ts       ← Token → Tailwind alias map (Step B output)
├── components/
│   ├── Hero.tsx             ← Hero component (token-driven)
│   ├── Header.tsx           ← Nav/header component
│   ├── Footer.tsx           ← Footer component
│   └── [page-specific]/    ← Menu, Gallery, BookingForm, etc.
├── pages/
│   ├── index.tsx            ← Home
│   ├── about.tsx
│   ├── contact.tsx
│   └── [category-pages].tsx ← Menu / Services / Portfolio / etc.
├── presets/
│   ├── bold.tokens.json     ← Token overrides for Bold preset
│   ├── minimal.tokens.json  ← Token overrides for Minimal preset
│   └── warm.tokens.json     ← Token overrides for Warm preset
├── assets/
│   ├── logo.svg
│   └── images/             ← Licensed hero + supporting images
├── metadata.json           ← category, tags, design_style, color_mood
├── README.md               ← 1-page setup + customization guide
└── marketplace.md          ← Marketplace listing description
```

---

## 7. Phased Roadmap (Current + Next)

| Phase       | Months | Focus                                        | Theme milestone                                      |
| ----------- | ------ | -------------------------------------------- | ---------------------------------------------------- |
| **0**       | -2→0   | Foundation, pre-seed, team                   | —                                                    |
| **1**       | 1–3    | Document substrate, Yjs CRDT, block registry | Theme schema (1.17), design system seeds (1.18)      |
| **2**       | 4–6    | Editor + design system                       | Theme Generator v0, Switcher, Customizer (2.26–2.31) |
| **3**       | 7–9    | AI + multiplayer + 30 free themes            | Ship categories 1–6 (3.34)                           |
| **4**       | 10–12  | Commerce + dev tools + 32 more themes        | All 62 free GA-ready (4.33) + marketplace beta       |
| **5**       | 13–15  | Beta + compliance + GTM                      | 62 free GA + 50 premium launch (5.41)                |
| **6**       | 16–18  | GA + open-core                               | 100 premium + 150 partner = 312 total                |
| **Post-GA** | 19–30  | Scale                                        | 500 themes total (338 partner marketplace)           |

**Current focus: Phase 1 & 2 — build the typed document substrate and theme engine foundation.**

> Full 204-task breakdown: `docs/LATTICE_Implementation_Plan_v3_0.md`

---

## 7.1 Phase 0 & 1 — Start Here (Ordered Task Checklist)

Work through these in order. Check off each before moving to the next.

### Phase 0 — Foundation (Pre-seed, M-2 to M0)

- [ ] **Task 0.1** — Monorepo scaffold: `pnpm` workspaces, Next.js 14 App Router, TypeScript strict, Tailwind CSS
- [ ] **Task 0.2** — CI/CD pipeline: GitHub Actions, ESLint, Prettier, Husky pre-commit hooks, lint-staged
- [ ] **Task 0.3** — Dev environment: `.env.example`, Docker Compose for local Postgres + Redis, README quickstart
- [ ] **Task 0.4** — GitHub MCP: configure auto-commit + PR workflow with conventional commits

### Phase 1 — Document Substrate (M1–M3)

- [ ] **Task 1.1** — Yjs CRDT foundation: `src/crdt/` — `Y.Doc` setup, `y-websocket` provider, shared type wrappers (`YMap`, `YArray`, `YText` helpers)
- [ ] **Task 1.2** — Block registry: `src/blocks/` — block type definitions, `Y.Map`-backed registry, block schema (Zod)
- [ ] **Task 1.3** — Site tree CRDT: `src/crdt/siteTree.ts` — pages, routes, and metadata as Yjs shared types
- [ ] **Task 1.4** — Persistence layer: Supabase MCP integration — save/load `Y.Doc` binary snapshots, user auth hooks
- [ ] **Task 1.5** — WebSocket server: `y-websocket` server setup, awareness protocol (cursor presence), reconnect logic
- [ ] **Task 1.6** — Command bus: `src/commands/` — typed command pattern for all editor mutations (undo/redo safe)
- [ ] **Task 1.17** — ThemeSchema.ts: Zod schema + inferred TypeScript types → `src/engine/theme/ThemeSchema.ts`
- [ ] **Task 1.18** — Design system seeds: `src/tokens/base.tokens.json` (W3C Design Token format, all CSS variables declared)

### First Commit Command for Claude Code

Paste this as your very first Claude Code message:

```
Read CLAUDE.md fully — all sections — before writing a single line of code.

Then execute Task 0.1: scaffold the LATTICE monorepo.

Requirements:
- pnpm workspaces (monorepo root + apps/web package)
- Next.js 14 App Router, TypeScript strict mode (tsconfig: strict: true, no implicit any)
- Tailwind CSS with empty tailwind.config.ts ready for token aliases
- src/ directory structure exactly matching Section 9 of CLAUDE.md
- ESLint (next/core-web-vitals) + Prettier + Husky pre-commit
- .env.example with placeholders for: DATABASE_URL, NEXT_PUBLIC_WS_URL, PEXELS_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY, STRIPE_SECRET_KEY
- README.md with quickstart (pnpm install → pnpm dev)

After scaffolding, commit: chore(infra): initialize LATTICE monorepo scaffold
Then open a PR.
```

---

## 8. The 62 Free Theme Categories (for reference)

| #   | Category               | Count | Ships |
| --- | ---------------------- | ----- | ----- |
| 1   | Restaurants & Food     | 8     | P3    |
| 2   | Hospitality & Hotels   | 4     | P3    |
| 3   | E-commerce / Retail    | 10    | P3    |
| 4   | Portfolio & Creative   | 8     | P3    |
| 5   | Professional Services  | 6     | P3    |
| 6   | Health & Wellness      | 4     | P3    |
| 7   | Beauty & Personal Care | 3     | P4    |
| 8   | Education              | 3     | P4    |
| 9   | Nonprofit & Community  | 3     | P4    |
| 10  | Events & Wedding       | 3     | P4    |
| 11  | Tech & SaaS            | 4     | P4    |
| 12  | Blog & Publishing      | 3     | P4    |
| 13  | Construction & Trades  | 3     | P4    |

---

## 9. Key File Locations

```
your-project/
├── CLAUDE.md                                  ← This file (Claude Code reads on every session)
├── docs/
│   └── LATTICE_Implementation_Plan_v3_0.md   ← Full 204-task business spec
├── src/
│   ├── types/              # All TypeScript interfaces (inferred from Zod — never hand-written)
│   ├── engine/
│   │   └── theme/
│   │       ├── ThemeSchema.ts      # Zod schema + inferred types (Task 1.17)
│   │       ├── ThemeGenerator.ts   # Parameterized theme generator (Task 2.26)
│   │       └── ThemeInheritance.ts # Base + child theme system (Task 3.32)
│   ├── commerce/           # All Stripe / payment logic (NEVER import into Yjs layer)
│   ├── crdt/               # Yjs shared types, provider setup, command bus
│   ├── blocks/             # Block registry and block type definitions
│   ├── tokens/             # W3C Design Token definitions (CSS variables — source of truth)
│   └── themes/
│       └── free/
│           └── [category]/
│               └── [theme-slug]/   # See Section 6.5 file structure
├── apps/
│   └── web/                # Next.js 14 App Router application
└── packages/               # Shared packages (ui, config, tsconfig)
```

---

## 10. GA Exit Criteria (do not close Phase 6 until all green)

- 50,000+ sites live; 5,000+ paying; $5M+ ARR
- All 62 free themes passing the 12-point quality bar
- 100 premium themes live; 150+ partner themes live
- All 6 critical user journeys sustained at GA bar for 30 days
- SOC 2 II · ISO 27001 · EAA · PCI v4.0.1 · EU AI Act · HIPAA · GDPR · CCPA · C2PA
- Open-core runtime on GitHub (MIT)
- LATTICE Pay live · B2B live · Multichannel live · 10 vertical templates live
