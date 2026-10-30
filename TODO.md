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
- [ ] Complete live Search/404 smoke checks for 1.1.32 (Local checks passed).
- [ ] Prep staging (dev.ies.aero): document deploy steps and enable ShortPixel + WebP on staging.

## Accessibility
- [ ] Slider sweep: keyboard focus order, contrast on indicators/buttons, and reduced‑motion behavior (ticker/autoplay off or paused by default when prefers-reduced-motion).

## Testimonials Slider verification
- [x] Local and live homepage checks passed in Chromium and WebKit at desktop and mobile widths: autoplay, all five navigation dots, stable logos, centred testimonials and a solid white background.
- [x] Version 1.1.32 resize regression passed on Local and live: resizing during transitions and dragging, desktop-to-mobile and back, and resizing with reduced motion enabled. Long quotations fit; no JavaScript page errors occurred.
- [ ] Check physical-device rotation and translated pages; repeat Site Editor and Lighthouse checks. Desktop WebKit testing does not certify physical iOS behaviour.
- Results: [Testimonials Slider QA](docs/TESTIMONIALS-SLIDER-QA.md), 30 October 2026.
