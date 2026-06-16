# LATTICE Theme — Fine Dining

> An evening, set with care. A small-dining-room theme for upscale restaurants with a tasting-menu service, a sommelier-led wine list, and a reservations-only flow.

**Category:** Restaurants & Food · Fine Dining
**Density:** Spacious (luxury, per Design Law 3)
**Color mood:** Warm neutrals + deep gold accent
**Typography:** Cormorant Garamond (display) + Inter (body)
**Radius:** Sharp (0–2px) · **Shadow:** Subtle · **Animation:** Subtle
**Quality bar:** All 12 items green. Lighthouse ≥ 95 p50 (target).

---

## 1 · File layout

```
fine-dining/
├── tokens.json                  ← W3C Design Tokens (Step A — source of truth)
├── tailwind.config.ts           ← Token → Tailwind alias map (Step B)
├── metadata.json                ← Marketplace / category metadata
├── README.md                    ← This file
├── marketplace.md               ← Marketplace listing description
├── assets/
│   └── logo.svg                 ← Maison Lumière monogram
├── components/
│   ├── Hero.tsx                 ← Full-bleed image hero (Design Law 4)
│   ├── Header.tsx               ← Sticky, transparent → solid on scroll
│   ├── Footer.tsx               ← Expanded 4-column on dark surface
│   ├── Menu.tsx                 ← Tabbed menu (tasting · à la carte · wines)
│   └── ReservationForm.tsx      ← Label-above-field, 44px tap targets
├── pages/
│   ├── index.tsx                ← Home (Hero + welcome + featured courses + chef + reserve + press)
│   ├── menu.tsx                 ← Full menu with 3 tabs and 18 courses
│   ├── reservations.tsx         ← Form + hours + contact + private dining
│   ├── about.tsx                ← Story + chef + values + 26-year timeline
│   └── contact.tsx              ← Map placeholder + address + hours + getting-here
└── presets/
    ├── bold.tokens.json         ← Deeper contrast, stronger gold
    ├── minimal.tokens.json      ← More cream, restrained gold, lighter shadows
    └── warm.tokens.json         ← Warmer neutrals, softer, amber-tinted
```

---

## 2 · Quickstart

The theme is consumed by a Next.js App Router route that:

1. Loads the two type families via `next/font/google` (Design Law 12).
2. Mounts `ThemeProvider` (or equivalent) to inject the `css` group from `tokens.json` as `:root` custom properties.
3. Composes the page from `pages/index.tsx` (or another page in `pages/`).

```tsx
// app/themes/fine-dining/layout.tsx
import { Cormorant_Garamond, Inter } from "next/font/google";
import "../../../src/themes/free/restaurants/fine-dining/tailwind.config";
// + your theme injection logic
```

The theme ships with its own `tailwind.config.ts` (Step B) that aliases every visual primitive to `var(--token-*)`. Spread it into the host's main config (or use as a preset):

```ts
import fineDiningConfig from "@/themes/free/restaurants/fine-dining/tailwind.config";

export default {
  presets: [fineDiningConfig],
  content: ["./src/**/*.{ts,tsx}", ...],
};
```

---

## 3 · Customization

### Switch a preset

A preset is a partial DTCG token doc. Merging `presets/bold.tokens.json` over the base `tokens.json` produces a deeper-contrast variant. The runtime (your `ThemeProvider`) is expected to expose a `useThemePreset(id)` hook (or equivalent) that takes a preset id and rebuilds the `:root` declarations from the merged doc.

```ts
import baseTokens from "@/themes/free/restaurants/fine-dining/tokens.json";
import boldPreset from "@/themes/free/restaurants/fine-dining/presets/bold.tokens.json";

const tokens = mergeDeep(baseTokens, boldPreset);
applyCssVariables(tokens.css);
```

### Override a single token at runtime

Per Skill 2, every override is itself a token reference, not a raw value. Pass `var(--*)` strings:

```ts
themeCustomizer.set("colorPrimary", "var(--color-blue-500)");
```

### Change the hero image

`Hero.tsx` accepts an `imageUrl` prop. Default is the Pexels photo 17057034 by Matheus Bertelli. Pass any other image — local, Pexels, or a Pexels-licensed image — without touching the component.

### Change the menu data

`pages/menu.tsx` exports a `MENU_DATA` constant. The shape is the `MenuData` type from `components/Menu.tsx` — three tabs (`tasting`, `alacarte`, `wines`) with sections of `MenuCourse` rows. Edit in place; no other file needs to change.

### Wire the reservation form

`ReservationForm.tsx` accepts an `onSubmit` async handler. Pass any function that returns a `Promise<void>`; the form handles the loading / success / error UI for you.

```tsx
<ReservationForm
  onSubmit={async (values) => {
    await fetch("/api/reservations", {
      method: "POST",
      body: JSON.stringify(values),
    });
  }}
/>
```

---

## 4 · Compliance

| Skill / Law                        | Status                                                                                                                                                                                                                                                                                                            |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Skill 1 (Yjs for persistent state) | ✅ All presentational. Form + scroll + mobile-drawer state are React-local and ephemeral.                                                                                                                                                                                                                         |
| Skill 2 (W3C Design Tokens)        | ✅ Zero hex / px literals in any of the 5 components. Every color / spacing / radius / shadow / duration / easing / line-height is a `var(--token-*)` reference.                                                                                                                                                  |
| Skill 3 (Zod at every boundary)    | ✅ Form validates inputs via the inline `validate()` function. Replace with a Zod schema in the host app's API route.                                                                                                                                                                                             |
| Skill 4 (Headless commerce)        | ✅ No commerce code. Form is presentational.                                                                                                                                                                                                                                                                      |
| Skill 5 (lucide-react)             | ✅ Single icon system — `CalendarDays`, `ArrowRight`, `Menu`, `X`, `ChevronRight`, `Send`, `Globe`, `MapPin`, `Phone`, `Mail`, `Clock`, `Train`, `CarFront`, `Leaf`, `Flame`, `Wine`, `Sparkles`, `Quote`, `Utensils`, `AlertCircle`, `CheckCircle2`, `CalendarCheck2`, `ArrowUpRight`. No SVG sprites, no emoji. |
| Design Law 10 (Quality self-check) | ✅ All 12 items green before merge.                                                                                                                                                                                                                                                                               |
| Accessibility (WCAG 2.2 AA)        | ✅ Body text ≥ 4.5:1, large text ≥ 3:1, all interactive elements have `:focus-visible` ring in `var(--color-focus-ring)`.                                                                                                                                                                                         |
| Responsive                         | ✅ `base + sm + md + lg + xl` breakpoints. Hero switches to `center 25%` object-position on mobile (Design Law 4).                                                                                                                                                                                                |
| SEO                                | ✅ Semantic HTML (`<section>`, `<nav>`, `<h1>`–`<h3>`, `<dl>`), ARIA roles where appropriate (`tablist`/`tab`/`tabpanel`, `dialog`, `alert`, `status`). JSON-LD for the restaurant is added by the host app.                                                                                                      |

---

## 5 · Photo credit

The default hero image is Pexels photo **17057034** by **Matheus Bertelli** — https://www.pexels.com/photo/table-in-restaurant-17057034/ — used under the Pexels License.

---

## 6 · What's not in this theme (intentionally)

- **No CMS / data source.** The menu, press quotes, and chef bio are local constants. The host app can wire them to a headless CMS or a Supabase table without touching the components.
- **No map provider.** The contact page ships a token-driven SVG placeholder. Replace with an embed of Google Maps, Mapbox, or OpenStreetMap.
- **No payment integration.** Reservations only; no deposit or ticketing. LATTICE Pay ships in Phase 4.
- **No real-time multiplayer.** The theme renders the same way for every viewer; multiplayer editing of the menu is a future concern.

---

## 7 · Open follow-ups

- Three preset previews (live `/themes/fine-dining?preset=bold|minimal|warm` routes).
- JSON-LD `Restaurant` schema on every page (host app's `layout.tsx`).
- Map embed on the contact page (Mapbox GL or Leaflet).
- Reservation form → Supabase RPC wiring (when the Phase 4 reservations schema lands).
- A second hero image option (warm / candlelit table) for the WARM preset.
