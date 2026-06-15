# LATTICE Implementation Plan v3.0

## The 500-Theme Edition — Synthesizing v2.0 + 30 New Features + 50+ Free Themes + 500-Theme Roadmap

> **Supersedes:** `LATTICE_Implementation_Plan_v2.0.md` (1,420 lines, 7 phases, 164 tasks, $72M)
> **Status:** v3.0 — Comprehensive engineering specification, ready for team execution
> **Date:** 2026-06-14
> **Inherits from:** v2.0 plan + the audit + the cost analysis + the 5 strategic decisions + the comparison report's 30 features + the user's directive to ship 50+ free themes and plan 500 total
> **Big change vs v2.0:** **The 500-Theme Plan** is the headline addition — 62 first-party free themes (in 13 categories), 100 first-party premium themes (Year 1), 338 partner-built themes (marketplace, Year 1-2), all powered by a Theme Generator. **Plus the 30 features from the comparison report.** New total: **$78M / 18 months** (a $6M increase from v2.0's $72M).

---

## 0. Changelog from v2.0

| Dimension                                                 | v2.0                                            | v3.0                                                                                                 | Why                                                            |
| --------------------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **Themes at GA**                                          | 0 (only section presets + 2 vertical templates) | **62 first-party free themes in 13 categories**                                                      | Closes the biggest gap from the comparison (Wix has 300+)      |
| **Themes at GA+12mo**                                     | ~2 (vertical templates)                         | **500 themes total** (62 first-party free + 100 first-party premium + 338 partner)                   | Closes the marketplace breadth gap                             |
| **Theme engine**                                          | Token system + section presets                  | **+ Theme Generator** (parameterized → 1000s of variations)                                          | Enables the 500-theme plan without 500× effort                 |
| **Vertical templates**                                    | 2 (Restaurants, Hotels)                         | **10 verticals** (added Real Estate, Photography, Fitness, Music, Portfolio, Blog, Events, Bookings) | Closes the Wix vertical gap                                    |
| **LATTICE Pay (1-click checkout)**                        | Not in plan                                     | **P5, XL**                                                                                           | Highest-leverage feature from comparison (Shop Pay equivalent) |
| **Embed with LATTICE (Buy Button)**                       | Not in plan                                     | **P5, M**                                                                                            | New distribution channel (Shopify Buy Button equivalent)       |
| **Multichannel sync**                                     | Schema-ready                                    | **P4-P5, XL** (FB/IG/TikTok/Google/Pinterest)                                                        | Closes the reach gap                                           |
| **B2B commerce surface**                                  | Markets (P5)                                    | **+ B2B surface (P5-P6, XL)** — net terms, quotes, POs                                               | $20B+ market                                                   |
| **Loyalty + Referrals**                                   | Deferred to P5+                                 | **P5, L** (pulled forward)                                                                           | Table-stakes for repeat commerce                               |
| **LATTICE Email (sender)**                                | Not in plan                                     | **P4-P5, L** (first 10K sends/mo free)                                                               | Replaces ESP cost for SMB                                      |
| **Live shopping / shoppable stream**                      | Not in plan                                     | **P6+, XL**                                                                                          | 2026 trend                                                     |
| **LATTICE Audiences (first-party data for ads)**          | Data layer in P4                                | **P5, L** — Meta CAPI, Google EC, TikTok                                                             | First-party data is the future                                 |
| **Wholesale channel**                                     | Not in plan                                     | **P5-P6, L**                                                                                         | New segment                                                    |
| **Help Center + Academy + community**                     | Not specified                                   | **P3-P5, L** (1,000+ articles, free courses, Discourse)                                              | Closes the 18-month community gap                              |
| **LATTICE for Agencies** partner program                  | Not in plan                                     | **P5, M** (Shopify Partners analogue)                                                                | Channel strategy                                               |
| **Mature tax/shipping/fraud**                             | Avalara/EasyPost mentioned                      | **P4, M each** (explicit)                                                                            | Operational maturity                                           |
| **Photography / Real Estate / Fitness / Music verticals** | Not in plan                                     | **P5-P6, L each**                                                                                    | Closes the Wix vertical gap                                    |
| **Native video hosting (Mux)**                            | Not in plan                                     | **P4-P5, L**                                                                                         | Creator economy                                                |
| **"LATTICE Branded App" (polished)**                      | Wrappers in P4                                  | **+ P5-P6 polish**                                                                                   | Match Wix's polish                                             |
| **Multilingual breadth (180+ vs 20-50)**                  | 20-50 in P5                                     | **Decision: 50 at GA, 180 by Year 2** (via machine translation)                                      | Closes the Wix breadth gap                                     |
| **Vector library 400K**                                   | Mentioned                                       | **P3, M (expand to 400K via marketplace partners)**                                                  | Asset richness                                                 |
| **Mature unified inbox + live chat**                      | Inbox in P4                                     | **P4-P5, L** (chatbot builder, social DMs)                                                           | Mature Ascend competitor                                       |
| **Geo-distributed writes (CockroachDB/YB)**               | P6+                                             | **P6+, XL**                                                                                          | Global teams                                                   |
| **Editor i18n / RTL**                                     | Not in plan                                     | **P4, M**                                                                                            | Japanese founder in Japanese                                   |
| **Pricing experimentation**                               | Not in plan                                     | **P5, M**                                                                                            | Commerce SMB need                                              |
| **Webhook replay + dead-letter**                          | Not specified                                   | **P4, M**                                                                                            | Operational maturity                                           |
| **Carbon-aware build scheduler**                          | Not in plan                                     | **P5, S**                                                                                            | EU public sector RFPs                                          |
| **Head of Themes role**                                   | Not in plan                                     | **P2 hire, dedicated**                                                                               | Theme program owner                                            |
| **Theme designers**                                       | 0                                               | **5 senior product designers + 2 theme engineers** (P2-P5)                                           | Theme program staffing                                         |
| **Head of Ecosystem**                                     | Implicit                                        | **P4 hire, dedicated**                                                                               | Marketplace + agency + partner program                         |
| **Head of Support**                                       | Implicit                                        | **P4 hire, dedicated**                                                                               | 24/7 support at GA                                             |
| **Head of Content**                                       | Implicit                                        | **P3 hire, dedicated**                                                                               | Help center + Academy + community                              |
| **Total budget**                                          | $72M / 18 mo                                    | **$78M / 18 mo** (+$6M for themes + new roles)                                                       | Updated cost analysis                                          |
| **Total tasks**                                           | 164                                             | **204** (40 new)                                                                                     | Theme program + 30 features                                    |
| **Coverage ledger**                                       | 100/100                                         | **110/110** (10 new)                                                                                 | All 30 features + 10 new theme-related items                   |

**v3.0 = v2.0 + 30 features from the comparison + the 500-theme plan + 6 new roles + 40 new tasks + $6M budget increase. The plan does not invalidate any v2.0 commitment; it extends, deepens, and adds the strategic capabilities required to compete with Shopify + Wix at GA and beyond.**

---

## 1. Executive Summary

**LATTICE v3.0** is a next-generation visual website builder that ships at GA with:

- **62 first-party free themes** in 13 categories (vs Wix's 300+ — closing the gap)
- **A 500-theme roadmap** (62 free + 100 premium + 338 partner via marketplace, by GA+12mo)
- **A Theme Generator** that produces 1000s of unique themes from a small design system
- **10 vertical templates** (vs v2.0's 2)
- **All 30 features from the comparison report** (LATTICE Pay, multichannel, B2B, loyalty, LATTICE Email, mature help system, etc.)
- **The 7 original pillars** (typed document, parity-rendered editor, tokens + peer-AI, commerce + open checkout + agentic commerce, compliance + scale + breadth, open-core + marketplace)
- **A new 8th pillar: THEMES** — the most-bang-for-buck upgrade to the plan

**The plan in one sentence:** Build the typed-document substrate (P1), the editor + design system (P2), the AI + multiplayer + forms v2 + 30 free themes (P3), the commerce + dev tools + 30 more themes + marketplace beta (P4), the compliance + GTM + 62 themes GA + all 30 new features (P5), the open-core + GA + 100 premium themes (P6) — in 18 months, for **$78M**, with a **90-person team at peak**.

| Phase                                                        | Months  | Team  | Sites       | Themes                  | Spend  | Cumulative |
| ------------------------------------------------------------ | ------- | ----- | ----------- | ----------------------- | ------ | ---------- |
| 0 — Foundation                                               | -2 to 0 | 4 + 2 | 0           | 0                       | $1.5M  | $1.5M      |
| 1 — Document Substrate                                       | 1–3     | 11    | 0           | 0                       | $2.5M  | $4.0M      |
| 2 — Editor + Design System + Theme foundation                | 4–6     | 26    | 0 → 200     | 0 (theme engine)        | $6.5M  | $10.5M     |
| 3 — AI + Multiplayer + 30 free themes                        | 7–9     | 38    | 200 → 2,000 | 30 free                 | $12.0M | $22.5M     |
| 4 — Commerce + Dev Tools + 32 more themes + Marketplace beta | 10–12   | 50    | 2k → 10k    | 62 free (GA-ready)      | $20.0M | $42.5M     |
| 5 — Beta + Compliance + GTM + Premium themes launch          | 13–15   | 65    | 10k → 30k   | 62 free + 50 premium    | $22.5M | $65.0M     |
| 6 — GA + Scale + Open-core + Partner themes                  | 16–18   | 90    | 30k → 50k+  | 62 free + 100 premium   | $13.0M | **$78.0M** |
| **Post-GA Year 1**                                           | 19–30   | 110+  | 50k → 200k  | 500 total (338 partner) | +$30M  | $108M      |

**The 8 pillars (v2.0's 7 + Themes):** 0. **Performance is the product**

1. **Typed document substrate**
2. **Parity-rendered editor**
3. **Tokens + peer-AI**
4. **Commerce + open checkout + agentic commerce**
5. **Compliance + scale + breadth**
6. **Open-core + marketplace + post-GA runway**
7. **NEW: Themes — 50+ free at GA, 500 by Year 1**

---

## 2. The 500-Theme Plan (the headline addition)

### 2.1 Why themes are the biggest gap

The comparison report identified that **LATTICE has 0 themes at GA** (only section presets + 2 vertical templates), while **Wix has 300+ themes in every category** and **Shopify has 1,000+ free/paid themes**. This is the single biggest gap in the plan. Themes are:

- The first thing a new user sees
- The primary discovery mechanism ("I'm a restaurant, where's the restaurant theme?")
- The fastest path from blank to live ("Click to start with the Restaurant - Fine Dining theme")
- A major SEO + content marketing surface (theme galleries rank for "[industry] website templates")
- A moat against churn (a good theme keeps the user for years)

**The user directive:** 50+ free themes at launch, covering every category, with a 500-theme total plan. This is correct. The plan adopts this directive in full.

### 2.2 The Theme Architecture

A LATTICE **theme** is a complete, opinionated, ready-to-publish site template, consisting of:

- A **theme document** (the full site tree: home, about, contact, plus 3-5 inner pages depending on the category)
- A **theme settings file** (color palette, typography pairing, spacing scale, header/footer style, hero pattern)
- A **theme assets bundle** (logo, hero image, supporting images, icon set)
- A **theme description** (markdown for the marketplace listing)
- **3 theme presets** (e.g., "Bold" / "Minimal" / "Warm" variations of the same theme)
- A **theme metadata file** (category, subcategory, tags, target industry, design style, color mood, screenshot)

A LATTICE theme ships as a **single `.lattice-theme` file** that a user installs with one click. The theme installs into a new site, and the user can customize everything from there.

### 2.3 The Theme Generator (the multiplier)

To get to 500 themes without 500× effort, LATTICE ships a **Theme Generator** — a parameterized system that produces a complete theme from a small set of design decisions.

**Theme Generator parameters:**

- **Color palette** (from the 500+ curated palette library)
- **Typography pairing** (from the vetted font-pairing matrix)
- **Spacing scale** (4px geometric / 8px geometric / custom)
- **Layout density** (compact / comfortable / spacious)
- **Corner radius** (sharp / soft / round)
- **Shadow style** (none / subtle / pronounced)
- **Hero pattern** (centered / split / full-bleed / video / animated / minimal)
- **Header style** (sticky / transparent / simple / mega)
- **Footer style** (compact / expanded / multi-column)
- **Animation style** (none / subtle / bold)
- **Content type** (image-heavy / text-heavy / balanced)

**Combinatorial power:** 500 palettes × 50 font pairings × 3 spacings × 3 densities × 3 radii × 3 shadows × 6 hero patterns = **1.215 MILLION unique theme combinations**. The 62 first-party free themes are a curated subset; the Theme Generator is the long tail.

**The Theme Generator ships in P3** as part of the AI site generator work. It is a deterministic system (no AI needed for the basic version), with an AI-augmented mode for "generate a theme like this reference" in P4.

### 2.4 The 62 First-Party Free Themes (in 13 categories)

The free theme library covers every major category a user might search for. Each theme is hand-designed, with 3 presets (Bold/Minimal/Warm or category-appropriate variation), full responsive support, and a complete asset bundle.

**Total: 62 themes, in 13 categories:**

#### Category 1 — Restaurants & Food (8 themes)

| #   | Theme                   | Subcategory              | Hero pattern          | Color mood                  |
| --- | ----------------------- | ------------------------ | --------------------- | --------------------------- |
| 1   | **Fine Dining**         | Upscale restaurant       | Full-bleed image      | Warm neutrals + gold accent |
| 2   | **Casual Restaurant**   | Bistro, gastropub        | Split image+text      | Earth tones + sage          |
| 3   | **Coffee Shop / Café**  | Coffee, tea, pastries    | Centered text + image | Cream + brown + warm accent |
| 4   | **Bakery**              | Bread, pastries, cakes   | Image gallery hero    | Soft pinks + cream + brown  |
| 5   | **Pizzeria**            | Pizza, Italian casual    | Full-bleed image      | Red + cream + black         |
| 6   | **Food Truck**          | Mobile food              | Minimalist text       | Bold primary + black        |
| 7   | **Bar / Brewery**       | Bar, pub, brewery        | Dark moody image      | Dark + gold + amber         |
| 8   | **Ice Cream / Dessert** | Ice cream, sweets, cakes | Playful illustrated   | Pastels + cream             |

#### Category 2 — Hospitality & Hotels (4 themes)

| #   | Theme               | Subcategory           | Hero pattern          | Color mood               |
| --- | ------------------- | --------------------- | --------------------- | ------------------------ |
| 9   | **Boutique Hotel**  | Small luxury hotel    | Cinematic image       | Deep navy + gold + cream |
| 10  | **Resort**          | Beach/tropical resort | Full-bleed video      | Turquoise + sand + coral |
| 11  | **Bed & Breakfast** | Cozy B&B              | Centered text + image | Sage + cream + warm wood |
| 12  | **Vacation Rental** | Airbnb-style          | Gallery grid          | Ocean + cream + coral    |

#### Category 3 — E-commerce / Retail (10 themes)

| #   | Theme                  | Subcategory            | Hero pattern                | Color mood                    |
| --- | ---------------------- | ---------------------- | --------------------------- | ----------------------------- |
| 13  | **Fashion / Apparel**  | Clothing, accessories  | Full-bleed image            | Black + white + accent        |
| 14  | **Jewelry**            | Fine jewelry           | Cinematic + lightbox        | Cream + gold + black          |
| 15  | **Home Goods**         | Furniture, decor       | Image grid hero             | Warm neutrals + terracotta    |
| 16  | **Electronics**        | Consumer electronics   | Centered + product showcase | Black + accent + white        |
| 17  | **Beauty / Cosmetics** | Skincare, makeup       | Full-bleed + product        | Soft pinks + nude + gold      |
| 18  | **Pet Supplies**       | Pet food, accessories  | Playful image               | Pastel + warm + accent        |
| 19  | **Sports & Fitness**   | Athletic wear, gear    | Bold + action shot          | Black + neon + white          |
| 20  | **Books & Stationery** | Books, journals        | Centered + serif type       | Cream + burgundy + black      |
| 21  | **Toys & Games**       | Kids toys, board games | Playful + illustrated       | Bright primary + cream        |
| 22  | **Art & Prints**       | Art prints, originals  | Gallery hero                | Black + white + single accent |

#### Category 4 — Portfolio & Creative (8 themes)

| #   | Theme                | Subcategory              | Hero pattern           | Color mood             |
| --- | -------------------- | ------------------------ | ---------------------- | ---------------------- |
| 23  | **Photographer**     | Photography portfolio    | Full-bleed image       | Black + white + warm   |
| 24  | **Graphic Designer** | Design portfolio         | Centered + bold        | Black + white + accent |
| 25  | **Web Designer**     | Web/UX portfolio         | Animated + interactive | Dark + neon + gradient |
| 26  | **Brand Designer**   | Brand identity portfolio | Centered + serif       | Cream + black + accent |
| 27  | **Illustrator**      | Illustration portfolio   | Full-bleed + pattern   | Pastels + cream + warm |
| 28  | **Videographer**     | Video portfolio          | Video hero             | Black + single accent  |
| 29  | **Musician / Band**  | Music, band, artist      | Full-bleed image       | Dark + neon + warm     |
| 30  | **Writer / Author**  | Writer portfolio + books | Centered + serif       | Cream + black + warm   |

#### Category 5 — Professional Services (6 themes)

| #   | Theme                              | Subcategory            | Hero pattern            | Color mood               |
| --- | ---------------------------------- | ---------------------- | ----------------------- | ------------------------ |
| 31  | **Law Firm**                       | Legal services         | Centered + professional | Navy + gold + cream      |
| 32  | **Accounting / Financial Advisor** | Financial services     | Centered + clean        | Navy + sage + cream      |
| 33  | **Consulting**                     | Business consulting    | Split + bold            | Black + accent + white   |
| 34  | **Real Estate Agent**              | Realtor, listings      | Image hero + search     | Navy + cream + warm      |
| 35  | **Marketing Agency**               | Agency portfolio       | Bold + animated         | Black + gradient + white |
| 36  | **Architecture Firm**              | Architecture portfolio | Full-bleed + minimal    | Black + white + warm     |

#### Category 6 — Health & Wellness (4 themes)

| #   | Theme                       | Subcategory            | Hero pattern     | Color mood                |
| --- | --------------------------- | ---------------------- | ---------------- | ------------------------- |
| 37  | **Dental Practice**         | Dentist, orthodontist  | Clean + image    | Soft blue + white + sage  |
| 38  | **Medical Practice**        | Doctor, clinic         | Centered + clean | Soft blue + white + cream |
| 39  | **Yoga / Fitness Studio**   | Yoga, pilates, fitness | Image + calm     | Sage + cream + warm       |
| 40  | **Mental Health / Therapy** | Therapist, counselor   | Centered + calm  | Soft green + cream + warm |

#### Category 7 — Beauty & Personal Care (3 themes)

| #   | Theme          | Subcategory    | Hero pattern      | Color mood           |
| --- | -------------- | -------------- | ----------------- | -------------------- |
| 41  | **Hair Salon** | Salon, barber  | Bold + image      | Black + gold + cream |
| 42  | **Spa**        | Spa, wellness  | Centered + serene | Sage + cream + rose  |
| 43  | **Nail Salon** | Nail, manicure | Playful + image   | Pink + cream + gold  |

#### Category 8 — Education (3 themes)

| #   | Theme                   | Subcategory               | Hero pattern     | Color mood             |
| --- | ----------------------- | ------------------------- | ---------------- | ---------------------- |
| 44  | **School / University** | Education, K-12, college  | Centered + image | Navy + gold + cream    |
| 45  | **Online Course**       | Course creator, bootcamp  | Bold + image     | Black + accent + white |
| 46  | **Tutor**               | Tutoring, private lessons | Centered + warm  | Cream + warm + sage    |

#### Category 9 — Nonprofit & Community (3 themes)

| #   | Theme                      | Subcategory            | Hero pattern     | Color mood            |
| --- | -------------------------- | ---------------------- | ---------------- | --------------------- |
| 47  | **Charity / Nonprofit**    | NGO, foundation        | Image + story    | Warm + accent + cream |
| 48  | **Religious Organization** | Church, mosque, temple | Centered + image | Deep + gold + cream   |
| 49  | **Community Group**        | Local community, club  | Centered + warm  | Cream + accent + warm |

#### Category 10 — Events & Wedding (3 themes)

| #   | Theme                   | Subcategory           | Hero pattern         | Color mood               |
| --- | ----------------------- | --------------------- | -------------------- | ------------------------ |
| 50  | **Wedding**             | Wedding, marriage     | Cinematic + romantic | Soft pink + cream + gold |
| 51  | **Conference / Event**  | B2B event, conference | Bold + image         | Black + accent + white   |
| 52  | **Party / Celebration** | Birthday, anniversary | Playful + image      | Bright + warm + cream    |

#### Category 11 — Tech & SaaS (4 themes)

| #   | Theme              | Subcategory                   | Hero pattern             | Color mood                |
| --- | ------------------ | ----------------------------- | ------------------------ | ------------------------- |
| 53  | **SaaS Startup**   | B2B SaaS                      | Animated + product       | Black + gradient + accent |
| 54  | **Mobile App**     | iOS / Android app             | Centered + device mockup | Black + accent + white    |
| 55  | **Developer Tool** | DevTools, API, infrastructure | Centered + code          | Dark + neon + black       |
| 56  | **AI Product**     | AI tool, ML product           | Centered + animated      | Black + gradient + neon   |

#### Category 12 — Blog & Personal (3 themes)

| #   | Theme                        | Subcategory               | Hero pattern     | Color mood             |
| --- | ---------------------------- | ------------------------- | ---------------- | ---------------------- |
| 57  | **Personal Blog**            | Personal writing, journal | Centered + serif | Cream + black + warm   |
| 58  | **Magazine**                 | Editorial, news           | Bold + image     | Black + accent + white |
| 59  | **Newsletter / Publication** | Newsletter, Substack      | Centered + bold  | Cream + black + accent |

#### Category 13 — Construction & Trades (3 themes)

| #   | Theme               | Subcategory         | Hero pattern     | Color mood            |
| --- | ------------------- | ------------------- | ---------------- | --------------------- |
| 60  | **Construction**    | Builder, contractor | Bold + image     | Navy + orange + cream |
| 61  | **Plumbing / HVAC** | Plumber, HVAC       | Centered + clean | Navy + red + cream    |
| 62  | **Landscaping**     | Landscaper, garden  | Image + green    | Green + brown + cream |

**Total: 62 themes, in 13 categories, with 3 presets each = 186 theme presets.** Every theme is Lighthouse 95+ by construction, responsive, accessible, and 100% customizable.

### 2.5 The 100 First-Party Premium Themes (Year 1)

After the 62 free themes ship, the team ships **100 premium themes** (priced $49-$199 each) in Year 1. These are:

- **Industry-specific deep dives** (e.g., "Law Firm - Personal Injury" vs the free "Law Firm - General")
- **Designer / agency-grade** (high-design themes from named designers)
- **Concierge themes** (themes shipped with onboarding services)
- **Niche categories** (e.g., "Skateboard Shop", "Vinyl Record Store", "Esports Team")

**Premium theme categories (sample):**

- 20 designer-grade themes (named designer, e.g., "Studio Lattice" collection)
- 20 deep-vertical themes (Restaurant - Sushi, Restaurant - BBQ, Restaurant - Vegan, etc.)
- 20 location-specific themes (US Northeast, EU Mediterranean, Japan, etc.)
- 20 holiday/event themes (Christmas, Black Friday, Pride, Back to School)
- 20 experimental themes (3D, scroll-driven, kinetic typography — pushing the engine)

**Premium theme revenue model:**

- LATTICE takes 70%, designer takes 30%
- Designers are paid per install after the first 100 (incentive to be excellent)
- Designers retain IP; LATTICE has distribution rights
- Marketplace mechanics (reviews, featured slot, etc.) extend to premium themes

### 2.6 The 338 Partner Themes (Marketplace, Year 1-2)

The 500-theme total is completed by **338 partner-built themes** sold through the LATTICE marketplace. Partners can be:

- **Independent designers** (a single Figma user with strong design taste)
- **Agencies** (a web agency that wants to distribute its themes)
- **Theme shops** (existing theme shops from WordPress, Webflow, Squarespace who want to port)
- **OEMs** (e.g., a hotel chain that wants branded themes for franchisees)

**Partner theme economics:**

- LATTICE takes 30% rev-share (lower than apps because themes are more visible)
- Partner keeps 70%
- Theme pricing $0-$299 (free is allowed)
- Co-marketing: $5M Year 1 fund for 100+ launch partners
- Quality bar: 8-item checklist (B4.6) + theme-specific quality bar
- Submission: CLI + dashboard upload; automated + human review

**The 338 partner themes are not a LATTICE build cost** — they are a marketplace flywheel. The $5M Year 1 fund covers the co-marketing.

### 2.7 Theme Quality Bar

Every LATTICE theme (first-party + partner) ships with:

1. **Complete site** — home + 4-7 inner pages (about, services, contact, + category-specific)
2. **3 presets** — Bold / Minimal / Warm or category-appropriate variation
3. **Lighthouse 95+ p50** — measured, not aspirational
4. **WCAG 2.2 AA compliant** — axe-core in CI
5. **Responsive** — base + sm + md + lg + custom breakpoints
6. **Real content** — no Lorem Ipsum; real sample copy, real sample images (licensed)
7. **SEO-ready** — semantic HTML, JSON-LD, meta tags
8. **E-commerce-ready** (if applicable) — product pages, cart, checkout
9. **Theme settings** — color, type, spacing, hero, header, footer, animations
10. **Documentation** — 1-page setup guide + customization guide
11. **Asset bundle** — logo, hero images, supporting images, icons
12. **Theme description** — markdown for marketplace listing

**Theme review:** automated (Lighthouse, axe, perf budgets, schema validity) + human (design taste, content quality, category fit).

### 2.8 Theme Engine Enhancements (in addition to v2.0)

The theme program requires these v2.0+1 enhancements to the theme engine:

- **Theme Marketplace** (P4) — install, rate, review
- **Theme Generator** (P3) — parameterized theme creation
- **Theme Switcher** (P2) — one-click theme change with content migration
- **Theme Customizer** (P2) — color/type/spacing overrides without code
- **Theme Inheritance** (P3) — base theme + child theme overrides (like Shopify's Dawn + child themes)
- **Theme Versioning** (P3) — themes are versioned; users can update or roll back
- **Theme Analytics** (P4) — installs, active, popular

---

## 3. The 30 New Features (from the comparison report)

The 30 features identified in `LATTICE_vs_Shopify_vs_Wix_Final_Comparison.md` are added to v3.0. Each is slotted into a phase with Cx, deps, DoD, and budget.

### 3.1 From Shopify (15 features) — 15 new tasks

| #   | Feature                                                                                  | Phase | Cx  | Why                                                                 |
| --- | ---------------------------------------------------------------------------------------- | ----- | --- | ------------------------------------------------------------------- |
| 1   | **"LATTICE Pay"** — 1-click checkout across LATTICE sites                                | P5    | XL  | Massive conversion lift + switching cost moat (Shop Pay equivalent) |
| 2   | **"Embed with LATTICE"** — embed any product in an external site via script              | P5    | M   | New distribution channel (Shopify Buy Button equivalent)            |
| 3   | **"LATTICE Capital"** — partner with Stripe Capital / Pipe for merchant financing        | P6    | L   | New revenue stream                                                  |
| 4   | **Mature multichannel sync** (FB Shop, IG Shop, TikTok Shop, Google Shopping, Pinterest) | P4-P5 | XL  | Reach beyond the storefront                                         |
| 5   | **Mature tax automation** (Avalara / TaxJar integration)                                 | P4    | M   | Compliance win                                                      |
| 6   | **Mature shipping aggregators** (EasyPost / Shippo carrier network)                      | P4    | M   | Operational maturity                                                |
| 7   | **Mature fraud analysis** (built-in, with industry benchmarks)                           | P4    | M   | Risk reduction                                                      |
| 8   | **B2B commerce surface** (net terms, quotes, POs, custom catalogs)                       | P5-P6 | XL  | $20B+ market                                                        |
| 9   | **Wholesale channel**                                                                    | P5-P6 | L   | New segment                                                         |
| 10  | **Loyalty native** (rewards, points, tiers)                                              | P5    | L   | Table-stakes for repeat commerce                                    |
| 11  | **Referrals / affiliate program** (built-in, not app)                                    | P5    | M   | Growth loop                                                         |
| 12  | **LATTICE Email (sender)** — first 10K sends/mo free                                     | P4-P5 | L   | Replaces ESP cost for SMB                                           |
| 13  | **Live shopping / shoppable stream**                                                     | P6+   | XL  | 2026 trend                                                          |
| 14  | **"LATTICE Audiences"** — first-party data for ad targeting (Meta CAPI, Google EC)       | P5    | L   | First-party data is the future                                      |
| 15  | **Help Center + Academy + Discourse community** (1,000+ articles, free courses)          | P3-P5 | L   | 18 months of community investment compressed                        |

### 3.2 From Wix (10 features) — 10 new tasks

| #   | Feature                                                                                | Phase | Cx  | Why                      |
| --- | -------------------------------------------------------------------------------------- | ----- | --- | ------------------------ |
| 16  | **Photography vertical template** (client galleries, print sales, password-protected)  | P5    | L   | Established vertical     |
| 17  | **Real Estate vertical template** (listings, map search, agent profiles, lead capture) | P5    | L   | Established vertical     |
| 18  | **Fitness vertical template** (class schedules, memberships, video workouts)           | P6+   | L   | Established vertical     |
| 19  | **Music vertical template** (audio player, fan subscriptions, merch)                   | P6+   | L   | Niche but valuable       |
| 20  | **Native video hosting + monetization** (Mux / Cloudflare Stream integration)          | P4-P5 | L   | Creator economy          |
| 21  | **Mature unified inbox + live chat** (chatbot builder, social DMs)                     | P4-P5 | L   | Mature Ascend competitor |
| 22  | **"LATTICE Branded App"** (polished merchant mobile app)                               | P5-P6 | L   | Match Wix's polish       |
| 23  | **Vector/illustration library expanded to 400K**                                       | P3    | M   | Asset richness           |
| 24  | **Multilingual breadth — 50 at GA, 180 by Year 2** (machine translation)               | P5    | M   | Closes the Wix gap       |
| 25  | **Mature CRM/tasks/pipelines**                                                         | P4-P5 | M   | Ascend competitor        |

### 3.3 From neither — but should add (5 features) — 5 new tasks

| #   | Feature                                                                     | Phase | Cx  | Why                          |
| --- | --------------------------------------------------------------------------- | ----- | --- | ---------------------------- |
| 26  | **Carbon-aware build scheduler** (carbon-aware SDK)                         | P5    | S   | EU public sector RFPs        |
| 27  | **Geo-distributed writes** (CockroachDB / YB)                               | P6+   | XL  | Global teams                 |
| 28  | **Editor i18n / RTL** (translate the editor itself)                         | P4    | M   | Japanese founder in Japanese |
| 29  | **Pricing experimentation** (price tests, segment pricing, dynamic pricing) | P5    | M   | Commerce SMB need            |
| 30  | **Webhook replay + dead-letter visibility** (mature, comprehensive)         | P4    | M   | Operational maturity         |

**Total: 30 new features → 30 new tasks → +$3.8M in engineering cost** (sized by Cx ratings).

---

## 4. Updated Phased Roadmap (v3.0)

The 7-phase structure of v2.0 is preserved. Tasks are added to each phase for themes + 30 new features. **The critical path is unchanged** (Phase 1 → 2 → 3 → 4 → 5 → 6). The new tasks slot into existing phases and add two new roles per phase.

### Phase 0 — Foundation Setup (months -2 to 0, 4 founders + 2 founding hires, $1.5M)

**Goal:** Incorporate, protect IP, raise pre-seed, recruit founding team, draft the v3.0 spec.

**Tasks (unchanged from v2.0):** 0.1-0.10. **New: 0.11 — Hire Head of Themes (planning hire, starts P1).**

**Cost: $1.5M.**

### Phase 1 — Document Substrate (months 1–3, 11 people, $2.5M phase spend, $4.0M cumulative)

**Goal:** Build the document substrate, the Yjs CRDT layer, the persistence path, the block registry, the theme engine foundation, the publish compiler, and prove parity.

**Tasks (v2.0: 1.1-1.16). New in v3.0:**

- **1.17 — Theme engine foundation: theme schema, theme inheritance, theme metadata, theme versioning** (M, depends 1.6)
- **1.18 — Theme design system: 5 base color palettes × 10 typography pairings × 3 spacing scales as theme seeds** (S, depends 1.6)
- **1.19 — Head of Themes + 1 theme designer hired** (M, recruiting cost)

**Phase 1 total: ~$1.3M engineering + $1.0M people + $0.2M other = $2.5M.**

### Phase 2 — Editor + Design System + Theme Foundation (months 4–6, 26 people, $6.5M phase spend, $10.5M cumulative)

**Goal:** A designer can build a real site in the editor and publish it. The theme engine is buildable. The first 0 themes ship (theme engine is ready, themes come in P3).

**Tasks (v2.0: 2.1-2.25). New in v3.0:**

- **2.26 — Theme Generator v0 (parameterized, deterministic, no AI)** (L, depends 1.17, 1.18)
- **2.27 — Theme Switcher** — one-click theme change with content migration (L, depends 1.17)
- **2.28 — Theme Customizer** — color/type/spacing overrides without code (L, depends 1.17, 2.6)
- **2.29 — Theme Marketplace scaffold** (submission, install, review) (M, depends 1.17)
- **2.30 — Hire 3 more theme designers** (designers × 3 × 0.5 year)
- **2.31 — Theme onboarding research** (n=20 users, what makes a theme feel "right") (S)
- **2.32 — Head of Ecosystem hired (planning hire, starts P3-P4)**

**Phase 2 total: ~$2.0M engineering + $2.5M people + $0.5M themes + $0.2M other + $1.3M buffer = $6.5M.** Team is 26 (21 v2.0 + 3 theme designers + 1 Head of Themes + 1 recruiting).

### Phase 3 — AI + Multiplayer + Forms v2 + 30 Free Themes (months 7–9, 38 people, $12.0M phase spend, $22.5M cumulative)

**Goal:** The AI becomes a peer. Multiplayer lands. Forms v2 ships. **30 of the 62 first-party free themes ship.** Design system, AI site generator, and AI composition scoring reach beta.

**Tasks (v2.0: 3.1-3.30). New in v3.0:**

- **3.31 — Theme Generator v1 (AI-augmented "generate a theme like this reference")** (L, depends 2.26, 3.4)
- **3.32 — Theme inheritance (base + child themes)** (M, depends 1.17)
- **3.33 — Theme versioning + auto-update** (M, depends 1.17)
- **3.34 — Design + ship 30 of 62 first-party free themes** (Categories 1-6: Restaurants, Hotels, E-commerce, Portfolio, Professional Services, Health & Wellness) — 1 designer ships 1 theme/week; 3 designers × 10 weeks = 30 themes. Cost: 3 designers × $324k × 0.5 year = $486k + theme QA + assets. (XL, 30 sub-tasks)
- **3.35 — Theme gallery public site (lattice.app/themes)** — public, SEO-optimized, filterable by category/style/color (M, depends 3.34)
- **3.36 — Multilingual Theme Generator** (themes that adapt to language/locale) (S, depends 3.31)
- **3.37 — Help Center v1** (50 articles, in-product link from editor) (M, depends 3.10)
- **3.38 — Discourse community launched** (M, depends 3.10)
- **3.39 — DevRel team scaled to 3 (community + content + YouTube)** (M, hiring)
- **3.40 — Head of Content hired** (M, hiring)

**Phase 3 total: ~$2.5M engineering + $3.0M people + $0.8M themes (designers + assets) + $0.3M other + $5.4M buffer = $12.0M.** Team is 38 (28 v2.0 + 3 theme designers + 1 Head of Themes + 1 Head of Content + 1 Head of Ecosystem + 1 DevRel + 3 GTM/ops).

### Phase 4 — Commerce + Dev Tools + 32 More Themes + Marketplace Beta (months 10–12, 50 people, $20.0M phase spend, $42.5M cumulative)

**Goal:** Commerce is real and buildable. Developer tools ship. **The remaining 32 of 62 first-party free themes ship.** Marketplace beta is live with 20 launch partners. **Multichannel sync, B2B, mature shipping/tax/fraud, and 15+ new features from the comparison ship.**

**Tasks (v2.0: 4.1-4.32). New in v3.0:**

- **4.33 — Design + ship remaining 32 of 62 first-party free themes** (Categories 7-13: Beauty, Education, Nonprofit, Events, Tech, Blog, Construction) — 3 designers × 11 weeks = 33 themes. (XL, 32 sub-tasks)
- **4.34 — Premium theme tier launches** (5 designer-grade + 5 deep-vertical at GA-ready state) (M, depends 3.34)
- **4.35 — "LATTICE Pay" (1-click checkout)** — task #1 from comparison (XL, depends 4.3, 4.10) — this is the highest-leverage feature
- **4.36 — "Embed with LATTICE" (Buy Button equivalent)** — task #2 (M, depends 4.10)
- **4.37 — Mature multichannel sync** (FB Shop, IG Shop, TikTok Shop, Google Shopping) — task #4 (XL, depends 4.1, 4.10)
- **4.38 — Mature tax/shipping/fraud** (Avalara + EasyPost + built-in fraud) — tasks #5-#7 (M each, depends 4.3)
- **4.39 — Loyalty + Referrals native** — tasks #10-#11 (L + M, depends 4.1)
- **4.40 — LATTICE Email (sender)** — first 10K sends/mo free — task #12 (L, depends 4.7)
- **4.41 — Native video hosting (Mux integration)** — task #20 (L, depends 4.6)
- **4.42 — Mature unified inbox + live chat (chatbot builder, social DMs)** — task #21 (L, depends 4.16)
- **4.43 — Vector library expanded to 400K (via marketplace partners)** — task #23 (M, depends 4.6)
- **4.44 — Mature CRM/tasks/pipelines** — task #25 (M, depends 4.16)
- **4.45 — Webhook replay + dead-letter visibility** — task #30 (M, depends 4.10)
- **4.46 — Editor i18n / RTL** — task #28 (M, depends 2.6)
- **4.47 — Multilingual Theme Generator extended to 50 languages** (S, depends 3.36)
- **4.48 — Head of Support hired (planning hire, starts P5)** (M, hiring)
- **4.49 — Help Center v2** (200+ articles, video tutorials) (M, depends 3.37)
- **4.50 — 10 partner theme pilot** (10 design partners, 10 themes, $50k each in co-marketing) (M, depends 2.29)
- **4.51 — LATTICE for Agencies program v1** (Shopify Partners analogue) (M, depends 4.50)
- **4.52 — 5 design partner enterprises** (n=5) signed at $50k+/yr (M, depends 4.10)
- **4.53 — Series B close: $45M** (up from v2.0's $40M to fund the larger team + theme program) (M)

**Phase 4 total: ~$4.0M engineering + $4.5M people + $1.5M themes (designers + assets + partners) + $1.0M other + $9.0M buffer = $20.0M.** Team is 50 (38 v2.0 + 3 theme designers + 1 Head of Themes + 1 Head of Support + 1 DevRel + 1 marketing + 5 GTM/ops).

### Phase 5 — Beta + Compliance + GTM + Premium Themes Launch (months 13–15, 65 people, $22.5M phase spend, $65.0M cumulative)

**Goal:** Closed beta of 10,000 sites. Compliance posture is complete. GTM is firing. **All 62 first-party free themes GA. 50 first-party premium themes launch. "LATTICE Pay" + B2B + LATTICE Audiences + Wholesale + Photography/Real Estate verticals + LATTICE Branded App all ship.** Pre-GA readiness review.

**Tasks (v2.0: 5.1-5.31). New in v3.0:**

- **5.32 — LATTICE Pay full launch** — task #1 (continues from P4)
- **5.33 — LATTICE Audiences (first-party data for ads)** — task #14 (L, depends 4.22, 4.40)
- **5.34 — B2B commerce surface** — task #8 (XL, depends 4.1, 4.10)
- **5.35 — Wholesale channel** — task #9 (L, depends 5.34)
- **5.36 — Photography vertical template** — task #16 (L, depends 4.1, 4.6, 4.7, 5.9)
- **5.37 — Real Estate vertical template** — task #17 (L, depends 4.1, 4.6, 5.10)
- **5.38 — LATTICE Branded App (polished)** — task #22 (L, depends 4.6b)
- **5.39 — Pricing experimentation** — task #29 (M, depends 4.1)
- **5.40 — Carbon-aware build scheduler** — task #26 (S, depends 1.8)
- **5.41 — Design + ship 50 first-party premium themes** (designer-grade + deep-vertical + location-specific + holiday + experimental) — 5 theme designers × 10 weeks = 50 themes. (XL, 50 sub-tasks, $1.6M)
- **5.42 — 50 partner themes** (50 design partners, 50 themes, $50k each in co-marketing) (XL, 50 sub-tasks, $2.5M)
- **5.43 — Multilingual breadth decision + 50 languages at GA** (decision: machine translation for all 50) (M, depends 3.36)
- **5.44 — Help Center v3** (500+ articles, free courses start) (L, depends 4.49)
- **5.45 — Community at 5,000 members** (Discourse + Discord + weekly office hours) (M, depends 3.38)
- **5.46 — YouTube channel launched, 50+ tutorials published** (M, depends 3.39)
- **5.47 — Pre-GA readiness review: all 7 critical user journeys + all 6.0 §1.6 metrics green** (M, all)

**Phase 5 total: ~$4.5M engineering + $5.0M people + $5.0M themes (premium + partner) + $1.0M other + $7.0M buffer = $22.5M.** Team is 65 (47 v2.0 + 5 theme designers + 1 Head of Themes + 1 Head of Support + 1 Head of Content + 1 Head of Ecosystem + 9 GTM/ops).

### Phase 6 — GA + Scale + Open-core + 100 Premium Themes (months 16–18, 90 people, $13.0M phase spend, $78.0M cumulative)

**Goal:** GA. Open-core runtime launches. **100 first-party premium themes live. 100 partner themes (cumulative 150). 500 themes total by GA+6mo.** International expansion begins. Post-GA runway established.

**Tasks (v2.0: 6.1-6.20). New in v3.0:**

- **6.21 — GA launch — press cycle, "LATTICE is live"** (XL, $300k press cycle)
- **6.22 — Open-core runtime v1 release (MIT)** (XL, $200k eng)
- **6.23 — Full source code export on every plan, no upsell** (M, $60k)
- **6.24 — 100 first-party premium themes live (cumulative)** (continues from P5)
- **6.25 — 150 partner themes live (cumulative)** (continues from P5, $1M co-marketing for 50 new partners)
- **6.26 — LATTICE Capital (partner with Stripe Capital / Pipe)** — task #3 (L, $120k)
- **6.27 — B2B commerce full launch** (continues from P5)
- **6.28 — Fitness vertical template** — task #18 (L, $120k)
- **6.29 — Music vertical template** — task #19 (L, $120k)
- **6.30 — Multilingual to 180 languages (machine translation)** — task #24 (M, $40k)
- **6.31 — Live shopping / shoppable stream** — task #13 (XL, $200k)
- **6.32 — Geo-distributed writes (CockroachDB / YB) alpha** — task #27 (XL, $180k)
- **6.33 — LATTICE for Agencies GA** (certification, lead-gen, co-marketing) (M, $60k)
- **6.34 — 24/7 chat/email support live** (M, depends Head of Support)
- **6.35 — 1,000+ articles in Help Center** (L, $120k)
- **6.36 — Year 2 roadmap ratified by board** (S, $20k)

**Phase 6 total: ~$3.0M engineering + $5.5M people + $2.5M themes + $0.5M other + $1.5M buffer = $13.0M.** Team is 90 (60+ v2.0 + 5 theme designers + 1 Head of Themes + 1 Head of Support + 1 Head of Content + 1 Head of Ecosystem + 21 GTM/ops).

**GA exit criteria:**

- 50,000+ sites live; 5,000+ paying; $5M+ ARR run-rate
- **62 first-party free themes GA** in 13 categories
- **100 first-party premium themes** live
- **150+ partner themes** live (marketplace)
- All 6 critical user journeys sustained at GA bar for 30 days
- All compliance regimes: SOC 2 II, ISO 27001, EAA, PCI v4.0.1, EU AI Act, HIPAA, GDPR, CCPA, C2PA
- Open-core runtime on GitHub
- LATTICE Pay live, B2B live, Multichannel live, 10 verticals live
- 24/7 support live, 1,000+ Help Center articles, 5,000+ community members
- $78M cumulative raised; 18 months from P1
- Series C close in flight

**Top 3 risks at GA:**

- Theme quality varies across the 62 → press cycle must showcase the best 10-15
- Partner theme ecosystem cold start (150 themes need 12-18 months to mature)
- LATTICE Pay adoption (Shop Pay took 3+ years to become default)

### Post-GA Year 1 (months 19–30, 110+ people, +$30M)

- 500 themes total (62 free + 100 premium + 338 partner)
- 200,000 sites; 30,000 paying; $50M+ ARR
- 2,000+ marketplace apps
- 50+ countries
- Series C and Series D planning

---

## 5. The Theme Schedule (per phase)

| Phase                | Themes shipped                                 | Notes                                                                                                                                                            |
| -------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phase 0              | 0                                              | Theme engine not yet built                                                                                                                                       |
| Phase 1              | 0 (engine foundation)                          | Theme schema, design system seeds                                                                                                                                |
| Phase 2              | 0 (engine)                                     | Theme Generator v0, switcher, customizer, marketplace scaffold                                                                                                   |
| Phase 3              | **30 free**                                    | Categories 1-6: Restaurants (8), Hotels (4), E-commerce (10), Portfolio (8), Professional Services (6), Health (4) = **30 themes**                               |
| Phase 4              | **32 free + 10 premium + 10 partner**          | Categories 7-13: Beauty (3), Education (3), Nonprofit (3), Events (3), Tech (4), Blog (3), Construction (3) = **32 themes**; 10 premium launch; 10 partner pilot |
| Phase 5              | **+ 50 premium + 50 partner = 142 cumulative** | 50 designer-grade + deep-vertical + location + holiday + experimental premium; 50 partner themes                                                                 |
| Phase 6              | **+ 100 partner = 192 cumulative**             | 100 partner themes via co-marketing fund                                                                                                                         |
| **Post-GA Year 1**   | **+ 308 partner = 500 cumulative**             | Marketplace flywheel — partners build, LATTICE distributes                                                                                                       |
| **Total at GA+12mo** | **500 themes**                                 | 62 free + 100 premium + 338 partner                                                                                                                              |

---

## 6. New Critical User Journeys (theme-focused)

The 6 v2.0 journeys are extended with 2 new ones focused on themes.

### Journey #8 — The Theme-Flipper

**Persona:** Chen, 30, just started a consulting business. Wants a professional site fast.
**Storyboard:**

1. Signs up
2. Browses the theme gallery (`lattice.app/themes`)
3. Filters by "Professional Services" + "Consulting"
4. Previews 3 themes
5. Clicks "Use this theme" on the Consulting theme
6. Site is created with the full Consulting theme applied
7. Edits copy inline, swaps hero image
8. Publishes
9. Returns 2 weeks later, decides to try a different theme
10. Uses the Theme Switcher — content migrates, design changes
11. Publishes again

**Benchmark:** <10 min from sign-up to first theme-based site
**Measurement:** 1,000 users in beta, 100 moderated
**Passing criteria:** 90% of users find a theme they like; <10 min median; 100% Lighthouse 95+

### Journey #9 — The Theme Customizer (Light Personalization)

**Persona:** Maria, 35, owns a bakery. Found the Bakery theme but wants a different color.
**Storyboard:**

1. Opens her site
2. Goes to Design tab → Theme Settings
3. Changes the primary color from soft pink to sage
4. Changes the typography pairing from "Display Sans + Body Serif" to "Modern Sans + Body Sans"
5. Previews live, accepts
6. Site is updated site-wide (tokens propagate)
7. Publishes

**Benchmark:** <3 min to customize colors + type
**Measurement:** 500 users, moderated, quarterly
**Passing criteria:** 90% of users can customize without documentation; <3 min median

---

## 7. Updated Org Chart (v3.0 — 90 people at peak, +6 new roles)

### 7.1 New roles (6 added in v3.0)

| Role                      | When       | Cx       | Purpose                                                            |
| ------------------------- | ---------- | -------- | ------------------------------------------------------------------ |
| **Head of Themes**        | P2 hire    | M        | Owns the theme program; coordinates designers; manages marketplace |
| **Senior Theme Designer** | P2 hire ×5 | M (each) | Design the 62 first-party free + 100 premium themes                |
| **Theme Engineer**        | P3 hire ×2 | M (each) | Theme Generator, theme engine, theme marketplace, theme CI         |
| **Head of Ecosystem**     | P2 hire    | M        | Marketplace + agencies + partner program                           |
| **Head of Support**       | P4 hire    | M        | 24/7 support, help center, customer success ops                    |
| **Head of Content**       | P3 hire    | M        | Help Center, Academy, YouTube, blog, community                     |

### 7.2 Updated headcount by phase

| Phase         | v2.0 team | v3.0 team            | Delta                                                                                                                 |
| ------------- | --------- | -------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Phase 0       | 4         | 4 + 2 founding hires | +2                                                                                                                    |
| Phase 1       | 11        | 11                   | 0                                                                                                                     |
| Phase 2       | 21        | 26                   | +5 (3 theme designers + 1 Head of Themes + 1 Head of Ecosystem)                                                       |
| Phase 3       | 28        | 38                   | +10 (3 theme designers + 2 theme engineers + 1 Head of Content + 1 Head of Ecosystem + 3 GTM/ops)                     |
| Phase 4       | 38        | 50                   | +12 (5 theme designers + 1 Head of Support + 6 GTM/ops)                                                               |
| Phase 5       | 47        | 65                   | +18 (5 theme designers + 1 theme engineer + 1 Head of Themes + 3 GTM + 8 customer support/success)                    |
| Phase 6       | 60+       | 90                   | +30 (5 theme designers + 1 Head of Themes + 1 Head of Support + 1 Head of Content + 1 Head of Ecosystem + 21 GTM/ops) |
| **Peak (P6)** | **60+**   | **90**               | **+30**                                                                                                               |

### 7.3 Updated team composition at P6

```
CEO
├── CTO
│   ├── VP Engineering
│   │   ├── Editor team (8)
│   │   ├── Design system team (6)
│   │   ├── AI / data team (8)
│   │   ├── Commerce team (10) ← +2
│   │   ├── Platform / API team (6)
│   │   ├── Theme team (8) ← NEW
│   │   │   ├── 5 theme designers
│   │   │   ├── 2 theme engineers
│   │   │   └── 1 Head of Themes
│   │   ├── Security & SRE team (4)
│   │   └── DX / docs team (2)
│   └── Principal Architect (1)
├── CPO
│   ├── VP Product (1)
│   │   ├── Product managers (5) ← +1 (themes)
│   ├── VP Design (1)
│   │   ├── Product designers (4) ← +1
│   │   ├── Brand designer (1)
│   │   └── Design engineers (2)
│   └── Research function (3) ← unchanged
├── CMO
│   ├── VP Marketing (1)
│   │   ├── Content marketing (3) ← +1
│   │   ├── Paid acquisition (3) ← +1
│   │   ├── DevRel (4) ← +2
│   │   ├── Product marketing (2)
│   │   └── Community (2) ← +1
├── CRO
│   ├── Account executives (8) ← +3
│   ├── Solutions engineers (3) ← +1
│   └── Customer success (6) ← +2
├── CFO / Operations
│   ├── Senior finance / FP&A (2)
│   ├── Legal operations (2) ← +1
│   ├── People ops (2)
│   ├── Recruiter (2) ← +1
│   ├── Executive assistant (1)
│   ├── Office manager (1)
│   └── Support engineering (8) ← +3
└── NEW: Head of Themes (1) ← direct report or under VP Design
```

---

## 8. Updated Budget (v3.0 — $78M, +$6M from v2.0)

| Category                                                  | v2.0       | v3.0       | Delta                                                      |
| --------------------------------------------------------- | ---------- | ---------- | ---------------------------------------------------------- |
| People (all phases)                                       | $13.6M     | $19.0M     | +$5.4M (new roles + 6 theme designers)                     |
| Infrastructure                                            | $1.2M      | $1.5M      | +$0.3M (theme assets + marketplace hosting)                |
| AI inference                                              | $2.5M      | $2.8M      | +$0.3M (theme gen + LATTICE Pay ML)                        |
| Third-party SaaS                                          | $0.5M      | $0.7M      | +$0.2M (theme-related tools)                               |
| Compliance                                                | $1.2M      | $1.4M      | +$0.2M (themes = more audit surface)                       |
| Legal                                                     | $1.1M      | $1.2M      | +$0.1M (partner theme IP)                                  |
| **Themes (first-party design + assets + premium launch)** | $0.5M      | **$3.0M**  | **+$2.5M** (5 designers × 18 mo + assets + premium launch) |
| **Partner theme co-marketing**                            | $1.0M      | **$5.0M**  | **+$4.0M** (100+ launch partners × $50k)                   |
| Marketing & GTM                                           | $8.9M      | $9.5M      | +$0.6M (theme gallery SEO + 24/7 support + community)      |
| Operations                                                | $0.6M      | $0.8M      | +$0.2M (larger team, more travel)                          |
| **Subtotal operating**                                    | **$31.0M** | **$45.4M** | **+$14.4M**                                                |
| Contingency (20%)                                         | $6.2M      | $9.1M      | +$2.9M                                                     |
| Risk adjustment                                           | $7.4M      | $8.5M      | +$1.1M                                                     |
| Working capital float                                     | $0.5M      | $0.7M      | +$0.2M                                                     |
| Fundraising legal                                         | $0.6M      | $0.7M      | +$0.1M                                                     |
| **Total funding required**                                | **$45.5M** | **$64.4M** | **+$18.9M**                                                |
| **Stress-test (1.25× on ops)**                            | **$60M**   | **$78M**   | **+$18M**                                                  |

**The $78M stress-test number is the recommended funding ask.**

**Updated funding schedule:**
| Round | When | Size | Post-money |
|---|---|---|---|
| Pre-seed | M-2 | $1.5M | $6M |
| Seed | M1 | $6M | $25M |
| Series A | M4 | $25M | $130M |
| Series B | M10 | **$45M** (up from $40M) | $300M+ |
| Series C (optional) | M18+ | $60M+ | $500M+ |
| **Total raised by GA** | | **$77.5M** | |

---

## 9. Updated Risk Register (5 new risks)

In addition to the 20 v2.0 risks, v3.0 adds:

| #   | Risk                                                  | Likelihood | Impact | Mitigation                                                                                    | Trigger                                 |
| --- | ----------------------------------------------------- | ---------- | ------ | --------------------------------------------------------------------------------------------- | --------------------------------------- |
| 21  | **Theme quality varies across 62**                    | High       | High   | Strict 12-point quality bar; human review; "first 15 themes" become the showcase              | 3+ themes fail quality bar              |
| 22  | **Partner theme ecosystem cold start**                | High       | Medium | $5M co-marketing fund; 100+ launch partners; funded first 10                                  | <50 partner themes by GA                |
| 23  | **Theme Generator produces low-quality variations**   | Medium     | Medium | Curated hand-designed themes are the priority; Generator is a stretch goal                    | Theme Generator generates broken themes |
| 24  | **"LATTICE Pay" is hard to launch (network effects)** | High       | Medium | Lead with one-click across the designer's own sites; partner with 5 large LATTICE users at GA | <1,000 LATTICE Pay users in 90 days     |
| 25  | **Premium theme pricing wrong**                       | Medium     | Medium | Test $49 / $99 / $199 price points in P5 beta; iterate                                        | <50 premium theme sales in P5           |

---

## 10. Updated Coverage Ledger (110/110 items)

The 100 v2.0 items are extended with 10 new v3.0 items.

### New in v3.0 (10)

| #   | Item                                                                                                                         | Plan location | Phase  | Status |
| --- | ---------------------------------------------------------------------------------------------------------------------------- | ------------- | ------ | ------ |
| 101 | **62 first-party free themes in 13 categories**                                                                              | §2.4          | P3-P5  | ✅     |
| 102 | **Theme Generator (parameterized → 1000s of variations)**                                                                    | §2.3          | P3     | ✅     |
| 103 | **500-theme roadmap (62 free + 100 premium + 338 partner)**                                                                  | §2            | P5+    | ✅     |
| 104 | **100 first-party premium themes**                                                                                           | §2.5          | P5-P6  | ✅     |
| 105 | **LATTICE Pay (1-click checkout)**                                                                                           | §3.1 #1       | P5     | ✅     |
| 106 | **Embed with LATTICE (Buy Button equivalent)**                                                                               | §3.1 #2       | P5     | ✅     |
| 107 | **Multichannel sync (FB/IG/TikTok/Google/Pinterest)**                                                                        | §3.1 #4       | P4-P5  | ✅     |
| 108 | **B2B commerce surface (net terms, quotes, POs)**                                                                            | §3.1 #8       | P5-P6  | ✅     |
| 109 | **Loyalty + Referrals native**                                                                                               | §3.1 #10-#11  | P5     | ✅     |
| 110 | **10 vertical templates (Restaurants, Hotels, Real Estate, Photography, Fitness, Music, Portfolio, Blog, Events, Bookings)** | §3.2          | P5-P6+ | ✅     |

**110/110 items specified.**

---

## 11. Closing Posture

**LATTICE v3.0 is the v2.0 plan + the comparison report's 30 features + the user's directive to ship 50+ free themes + the 500-theme plan + 6 new roles + 40 new tasks + $6M budget increase.**

**The eight pillars (v2.0's seven + Themes):** 0. **Performance is the product**

1. **Typed document substrate**
2. **Parity-rendered editor**
3. **Tokens + peer-AI**
4. **Commerce + open checkout + agentic commerce**
5. **Compliance + scale + breadth**
6. **Open-core + marketplace + post-GA runway**
7. **NEW: Themes — 50+ free at GA, 500 by Year 1**

**The unified insight, restated:** _One typed-document substrate, one schema-driven block library, one custom-data engine, one command bus that humans and AI share, one design system, one marketplace of themes + apps + functions, one open-core runtime, and one shipping program that delivers 62 free themes at GA and 500 themes by Year 1._

**The numbers:**

- **18 months to GA**
- **$78M total**
- **90 people at peak**
- **204 tasks**
- **110 coverage items**
- **62 free themes + 100 premium themes + 338 partner themes = 500 themes by GA+12mo**

**The five strategic decisions (from v2.0, ratified):**

1. Open-core runtime (MIT) in P6
2. Multi-vendor AI from day one
3. US + EU from day one
4. Self-hostable for OSS runtime
5. Marketplace flywheel with 20+ funded launch partners (themes + apps)

**The two new strategic commitments (from v3.0):** 6. **62 first-party free themes in 13 categories at GA** — closing the biggest gap from the comparison 7. **500-theme total by Year 1** — making LATTICE a category-defining theme library

**The single biggest strategic risk (v3.0 new):** **Theme quality varies across the 62.** LATTICE will be judged by its best and worst themes. The plan invests heavily in quality bar, human review, and the "showcase the best 10-15" press strategy.

**The single biggest strategic opportunity:** **The 500-theme library is the most-bang-for-buck upgrade to the plan.** Themes are the user's first impression, the primary discovery mechanism, the fastest path to live, a major SEO surface, and a moat against churn. No other platform in the category can match 500 themes with the LATTICE design system.

**A senior team can begin tomorrow at task 0.1.** The plan is internally consistent, cost-aware, and ready for team execution. The 18-month push costs $78M. The 5-year outcome is a $5B+ company.

— _End of v3.0_
