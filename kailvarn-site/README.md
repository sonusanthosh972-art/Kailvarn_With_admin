# KailVarn — Premium Interior Design Studio (visual redesign prototype)

Standalone 5-page visual redesign of https://testing-ai-omega.vercel.app/ .
Vanilla HTML/CSS/JS — no build step. All copy, contact data, services, process,
testimonials and the 200-design dataset are taken verbatim from the live site.

## Pages

- `index.html` — cinematic hero, trust strip, brand statement, 4 editorial service
  cards, portfolio preview with filters, why-KailVarn, 4-step process, testimonial
  slider, CTA, footer
- `services.html` — Full Home / Kitchen / Furniture / Painting deep-dives with
  problem→solution pairs and inclusion checklists (real content)
- `designs.html` — the real 200-design collection with 8 category tabs, asymmetric
  editorial grid, project lightbox, conditional AR button
- `about.html` — story, mission/vision, problems solved, values, team, comparison table
- `contact.html` — contact cards, WhatsApp enquiry form, service areas, FAQ accordion

## Design system

Deep navy `#0B103B` / `#11184D` / `#070A25`, architectural gold `#F2B21B` / `#D9A441`,
warm cream `#F5F1E8`, soft white `#FAFAF7`. Playfair Display + Manrope.
~60% light / ~30% navy / ~10% gold. Subtle motion only (fade-up reveals, 1.03 image
zoom, gold timeline draw). Slim promo banner on every page, dismiss per tab.

## Develop

Edit `bodies/*.html` or `partials/*`, then run `python3 build.py`.

## Notes

- AI Redesign / AR routes are preserved as links (`/ar/<slug>`); the prototype does
  not reimplement the AI generation backend.
- FAQ answers are concise paraphrases of the site's own published claims.
- Before/After section intentionally omitted — no real before/after assets exist.
