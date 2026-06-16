# Fine Dining — Marketplace Listing

> A small-dining-room theme for upscale restaurants. Warm neutrals, deep gold, Cormorant Garamond headlines, full-bleed candlelit photography. Spacious density, sharp corners, subtle shadows — black-tie without being cold.

**Category:** Restaurants & Food → Fine Dining
**Industries:** Restaurants · Boutique hotels · Wine bars · Private dining
**Styles:** Luxury · Serif · Editorial · Intimate
**Color mood:** Warm neutrals + deep gold

---

## What you get

A complete five-page fine-dining site, ready to install in a single click.

- **Home** — full-bleed hero, brand statement, three featured courses, chef pull-quote, reservation CTA, press strip.
- **Menu** — three tabs (Tasting · À la carte · Wines), eighteen courses with prices and dietary tags, optional wine-pairing suggestions.
- **Reservations** — full form with name, email, phone, date, time, party size, occasion, and special-request fields. Inline validation, success and error states, 44px tap targets, WCAG-compliant focus rings.
- **About** — restaurant story, chef biography (Élise Marchand), three values, and a twenty-six-year timeline.
- **Contact** — address, hours, direct lines, a token-driven SVG map placeholder, and getting-here guidance.

Plus a sticky transparent header that solidifies on scroll, an expanded 4-column footer with a newsletter signup, and three presets — **Bold** (deeper contrast, stronger gold), **Minimal** (more cream, restrained), and **Warm** (warmer neutrals, amber-tinted).

## What it does well

- **Tasting-menu storytelling.** Three featured courses on the home page, full menu on a dedicated page with tabbed navigation, optional wine pairings on every dish.
- **Reservation flow.** A real form with date / time / party-size pickers, occasion, and special-request fields. Pairs with any backend that accepts a `ReservationFormValues` payload.
- **Press / accolades strip.** Reusable on the home page for outlets and awards (Michelin, Eater, NYT, etc.).
- **Calendar-hour layout.** Each page has a "card" for the side content (hours, contact, getting here) that lifts into its own column on `md`.

## What it doesn't do

- No CMS — menu data and copy are local constants in `pages/menu.tsx`. Wire to a headless CMS or Supabase for live updates.
- No payment — no deposits, no ticketing, no LATTICE Pay. Reservations only.
- No real-time multiplayer editing of the menu.
- No map provider — the contact page ships a token-driven SVG placeholder. Drop in your Mapbox / Google Maps / Leaflet key.

## Quality bar

All twelve Section 6 quality-bar items green before merge:

1. ✅ Complete site — 5 inner pages + home.
2. ✅ 3 presets — bold / minimal / warm.
3. ✅ Lighthouse target ≥ 95 p50.
4. ✅ WCAG 2.2 AA — body text 4.5:1, large text 3:1, focus rings on every interactive element.
5. ✅ Fully responsive — `base + sm + md + lg + xl` with mobile object-position override on the hero.
6. ✅ Real copy — every dish, quote, and bio is written. No Lorem Ipsum.
7. ✅ SEO-ready — semantic HTML, ARIA roles (`tablist`/`tab`/`tabpanel`, `dialog`, `alert`, `status`), JSON-LD schema on the host layout.
8. ✅ E-commerce-ready — `ReservationForm` accepts a host `onSubmit` for any commerce backend; no LATTICE Pay yet (Phase 4).
9. ✅ Theme settings wired to tokens — every visual primitive is a `var(--token-*)` reference.
10. ✅ 1-page documentation — `README.md` covers setup, customization, and compliance.
11. ✅ Asset bundle present — `assets/logo.svg` monogram, default hero image (Pexels-licensed).
12. ✅ Marketplace description written — this file.

## How to install

The theme ships as a single `.lattice-theme` package. Install with one click from the marketplace, or:

1. Drop the `fine-dining/` folder into `src/themes/free/restaurants/`.
2. Spread the theme's `tailwind.config.ts` into your main Tailwind config.
3. Wire `next/font/google` to load **Cormorant Garamond** and **Inter** in your app layout.
4. Mount `ThemeProvider` (or equivalent) to inject the `css` group from `tokens.json` as `:root` custom properties.
5. Render a page with `<FineDiningHome />` from `pages/index.tsx`.

A live preview is available at `/themes/fine-dining` once the theme is mounted.

## Photo credit

Default hero image: Pexels photo **17057034** by **Matheus Bertelli**, used under the Pexels License.

## License

First-party free theme — included in every LATTICE site at no cost. See `LICENSE` in the repo root.

## Maintainer

LATTICE Theme Team — claude@lattice.app.
