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
