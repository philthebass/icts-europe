# Testimonials Slider QA: 1.1.32

Date: 30 October 2026. **Status: live and homepage Testimonials Slider checks passed.** Release tag: `v1.1.32`. Local URL: `https://iesaero.local/`. Automated checks: Codex using Playwright. Local uses the existing source symlink; the packaged ZIP is verified against the tag rather than installed over that symlink.

The Testimonials Slider now retries height recalculation after a viewport resize interrupts a slide transition or drag. Long quotations fit again once movement settles, while the stable height, centred layout and white background introduced in 1.1.31 remain intact.

## Validation
- Reproduced the failure on Local before the fix: a 438px viewport remained around a 581px testimonial after a desktop-to-mobile resize.
- Local Chromium and WebKit checks passed at 1440 × 1000 and 390 × 844: autoplay, resize during a transition, all five navigation dots, no logo movement between slides, centred content, white background, resizing back to desktop, resizing during dragging, reduced motion and resizing with reduced motion enabled. No JavaScript page errors occurred.
- JavaScript/PHP syntax, PHPCS and whitespace checks passed.
- All 36 transactional WordPress regression assertions passed; fixtures rolled back.
- Rendered Local Search results, no-results and 404 checks passed, including headers and footers.
- Physical-device rotation, translated pages, Site Editor and fresh Lighthouse checks were not repeated. Desktop WebKit tests do not certify physical iOS behaviour.

## Live deployment and verification

- Philip confirmed uploading 1.1.32 to production and clearing caches on 30 October 2026.
- Verified `https://ies.aero/` serves the theme stylesheet with `ver=1.1.32` and the updated Testimonials Slider script.
- Read-only Playwright checks passed in Chromium and WebKit at 1440 × 1000 and 390 × 844, using the same regression scenarios as Local.
- Resizing during a slide transition and while dragging now recalculates the tallest-slide height once movement settles. Long quotations are no longer clipped. Resizing back to desktop also passed.
- Chromium measured approximately 438px at desktop width and 581px at mobile width; WebKit measured approximately 438px and 578px respectively, matching their tallest testimonial within rounding tolerance.
- Autoplay and all five navigation dots passed. The logos below did not move between slides; the white background and vertical centring were preserved.
- Reduced motion disabled autoplay, and resizing during manual transitions still passed. No JavaScript page errors occurred.
- GitHub release and verified theme ZIP: [1.1.32](https://github.com/philthebass/icts-europe/releases/tag/v1.1.32).

## Remaining checks

Physical-device rotation, translated pages, Site Editor and a fresh Lighthouse comparison remain outstanding. Live Search/404 smoke checks have not been recorded for this deployment; their Local checks passed. These are separate from the completed live homepage Testimonials Slider checks.

## Previous release record

# Testimonials Slider QA: 1.1.31

Date: 30 October 2026. Candidate: tag `v1.1.31`. Local URL: `https://iesaero.local/`. Manual acceptance: Philip; automated checks: Codex. Browser/device details were not recorded.

The Testimonials Slider now keeps a stable height as short and long quotations rotate, preventing the logos below from moving. Each testimonial is vertically centred, and a solid white background hides the decorative strands throughout the section.

## Installation
Download `icts-europe-v1.1.31.zip` from this release and upload it through WordPress Appearance → Themes → Add New → Upload Theme, replacing the existing ICTS Europe theme. Purge page/CDN caches and hard-refresh afterwards. No database migration or permalink flush is required.

## Validation
- Philip confirmed the height fix and final appearance on Local on 30 October 2026.
- JavaScript syntax, PHP syntax, PHPCS and whitespace checks passed.
- All 36 Local WordPress regression assertions passed; temporary fixtures were rolled back.
- Local homepage returned 200. Search results, no-results and 404 responses rendered their expected content with headers and footers.
- Browser automation was unavailable. Mobile, translated-page, keyboard/reduced-motion, Site Editor and fresh Lighthouse checks were not repeated for this release.
- The ZIP is built from tag v1.1.31. Package integrity and source-file matching are verified separately before publication. Local testing uses the existing source symlink; the ZIP has not been installed over it.

After upload, check the homepage testimonials at desktop and mobile widths, confirm long quotations fit and the logos remain stationary, then smoke-test Search and 404. Production installation is handled separately by Philip.
