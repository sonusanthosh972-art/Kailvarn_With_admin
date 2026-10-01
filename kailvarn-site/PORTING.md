# KailVarn — Full-Site Visual Redesign · Porting Guide

Standalone prototype: `~/workspace/kailvarn-site` (5 pages, vanilla HTML/CSS/JS).
Source of truth for behavior/data: https://testing-ai-omega.vercel.app/ (Next.js).

**Do NOT rewrite the Next.js app.** Port section-by-section below, keeping every
existing route, API call, form handler, data file and component contract intact.

## Page map

| Prototype page | Existing route | Notes |
|---|---|---|
| `index.html` | `/` | Hero, trust strip, statement, services, portfolio preview, why, process, testimonials, CTA |
| `services.html` | `/services` (existing page) | 4 deep-dives with real copy already on the route — re-skin only |
| `designs.html` | `/our-design` | Renders the **real 200-design dataset** (`assets/js/designs.js`, extracted verbatim from the live page). Keep the existing data-loading in the app; only adopt the layout/filter/lightbox styling. Category tabs map the 30 real categories → 8 tabs (see `ROOMMAP` in `assets/js/main.js`). AR stays conditional on `arSlug` → `/ar/<slug>` (only "Modern Living Room Design 1"). |
| `about.html` | `/about` | Story, mission/vision, problems→solutions, values, team, comparison table — all copy is verbatim from the live page |
| `contact.html` | `/contact` | Contact cards + enquiry form. The form currently POSTs/opens WhatsApp with a prefilled message — **preserve that exact behavior**; only the styling changed |

## Design tokens (copy into your theme)

```css
--navy:#0B103B; --navy-2:#11184D; --navy-dark:#070A25;
--gold:#F2B21B; --gold-deep:#D9A441;
--cream:#F5F1E8; --paper:#FAFAF7;
--ink:#111111; --muted:#77736B;
Fonts: "Playfair Display" (headings) + "Manrope" (body/UI) — max 2 families.
Buttons: 8px radius, gold bg + navy text, hover lift 2px. No pill buttons.
```

## What must NOT change during porting

- Routes: `/`, `/services`, `/our-design`, `/about`, `/contact`, `/ar/modern-living-room-design-1`
- The 200-design dataset (titles, categories, descriptions, images, `arSlug`)
- Enquiry form → WhatsApp prefilled message behavior
- Promo banner: always present, dismiss persists per tab (`sessionStorage`)
- Contact data: 8401226123 · wa.me/918401226123 · kailvarn0@gmail.com · Silvassa/Vapi/50km · Mon–Sat 9–7
- Testimonials: the 6 real client quotes (kept verbatim, Hinglish as on the live site)

## Deliberately omitted

- **Before/After slider** — the brief asked for it only "if suitable existing assets are
  available." No real before/after assets exist; building one with stock photos would
  imply a fake transformation, so it was left out. Add it when real project photos exist.
- No fake stats, awards or certifications were invented anywhere.

## Rebuild after editing

Page bodies live in `bodies/*.html`, shared chrome in `partials/`.
Run `python3 build.py` to regenerate the 5 pages.
