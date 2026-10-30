# TODO — ICTS Europe Theme

- [ ] Add temporary alias palette entry `brand-terciary` for one release, or migrate content to `brand-tertiary`.
- [ ] Align `style.css` headers with README (WP/PHP/License URL) and bump version.
- [ ] Add `languages/` and generate POT file for `icts-europe`.
- [ ] Centralize vendor asset registration (Flickity) and reuse handles.
- [ ] Consider a pause control for hero slider (ARIA) if autoplay remains.

## Editor UX
- [ ] Lock down patterns/templates: hide unused ones for editors and expose only the curated set.

## Deployment
- [x] Release 1.1.27: automated Local checks passed and Philip confirmed Local testing on 7 October 2026.
- [x] Release 1.1.32 is live: Philip uploaded the theme and cleared caches; Codex verified the live homepage Testimonials Slider on 30 October 2026.
- [ ] Complete live Search/404 smoke checks for the current release, 1.1.33 (Local checks passed).
- [ ] Prep staging (dev.ies.aero): document deploy steps and enable ShortPixel + WebP on staging.

## Accessibility
- [ ] Slider sweep: keyboard focus order, contrast on indicators/buttons, and reduced‑motion behavior (ticker/autoplay off or paused by default when prefers-reduced-motion).

## Logos Slider verification
- [x] Logo-limit, touch-hover and eager-loading fixes are included in live 1.1.33; Philip confirmed deployment and cache clearing.
- [x] Local image-loading and template checks passed; historical live full-loop results are recorded in [Logos Slider QA](docs/LOGOS-SLIDER-QA.md).
- [ ] Check the current live Airlines and TravelDoc Pro travel providers pages: compare unique logo counts with matching records and confirm complete loops with no missing logos or unexpected jumps.
- [ ] Complete physical iPhone/iPad acceptance and slow-network checks. Desktop WebKit results do not certify physical iOS performance.
- [ ] Record dragging, logo-link clicks/taps, hover/focus pausing and reduced-motion checks on the current slider; do not treat implementation or unrelated slider tests as acceptance.
- [ ] Complete Site Editor manual checks and a fresh Lighthouse comparison.

## Testimonials Slider verification
- [x] Local and live homepage checks passed in Chromium and WebKit at desktop and mobile widths: autoplay, all five navigation dots, stable logos, centred testimonials and a solid white background.
- [x] Version 1.1.32 resize regression passed on Local and live: resizing during transitions and dragging, desktop-to-mobile and back, and resizing with reduced motion enabled. Long quotations fit; no JavaScript page errors occurred.
- [ ] Check physical-device rotation and translated pages; repeat Site Editor and Lighthouse checks. Desktop WebKit testing does not certify physical iOS behaviour.
- Results: [Testimonials Slider QA](docs/TESTIMONIALS-SLIDER-QA.md), 30 October 2026.

## Category marker colour synchronisation
- [x] Implement native Polylang synchronisation and pass 18 transactional Local assertions across all nine languages, including reverse-language changes, Default, existing mismatches and unrelated metadata isolation.
- [x] Philip confirmed category marker translation synchronisation works well in Local.
- [x] Add swatches to the selector and Categories list; pass 24 Local integration checks and Chromium/WebKit rendered-control checks.
- [x] Philip accepted the category colour swatches in Local on 30 October 2026 for release 1.1.33.
- [x] Release 1.1.33 is live and caches are cleared. Philip confirmed the live Categories swatches and colour synchronisation work correctly on 30 October 2026.
- Results: [Category Marker QA](docs/CATEGORY-MARKER-QA.md).
