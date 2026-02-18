# DECISIONS — ICTS Europe Theme

Format: YYYY-MM-DD — Decision — Context — Consequences

2026-02-04 — Heading size slugs use h-1..h-6 — WP generates hyphenated CSS variables; aligning slugs and references prevents 16px fallback — Theme JSON and styles now consistent.

2026-02-04 — Added x-small and large font-size presets — CSS referenced these sizes; defining them avoids var() fallbacks — Editor and front end consistent.

2026-02-04 — Added color tokens base/main/secondary/tertiary/border-light — Patterns and CSS reference these tokens — Variables now resolve on front end and editor.

2026-02-04 — Renamed brand-terciary → brand-tertiary — Correct spelling and consistent naming — Audit content for old slug; add temporary alias if needed.

2026-02-04 — Standardized stylesheet handle (icts-europe) and moved inline CSS to wp_add_inline_style — Predictable enqueue and safer output — Dependencies can inline to this handle.

2026-02-05 — Hero Slider editor preview is CSS-only — JS preview caused instability in the editor — Preview shows first slide only and is view-only; editing remains stacked.

2026-02-05 — RTL support handled in slider CSS/JS — Polylang RTL pages need mirrored layout — Overlay gradient flips, content aligns right, indicators align right, and Flickity runs with rightToLeft.

2026-02-13 — Header utilities use scoped template-part CSS/JS — Header spacing, iconized search/language controls, and modal search behavior needed design parity without changing global button defaults — Header styles are isolated to `.icts-site-header`; search modal is handled by `assets/js/header-search-modal.js`.

2026-02-13 — Removed Custom HTML blocks from header template — Editors should manage the header with standard blocks only — Search trigger and language icon are now styled via scoped CSS, and modal markup is rendered via `wp_footer` in `functions.php`.

2026-02-13 — Replaced front-end Polylang select with custom language popover — Native `<select>` styling was too limited for design parity and RTL control — Theme now intercepts `polylang/language-switcher` output on front end via `render_block`, using `pll_the_languages( raw )` data plus custom JS/CSS; editor block workflow remains unchanged.

2026-02-13 — Moved header container spacing/border from block inline styles to scoped CSS — Inline block styles forced repeated `!important` overrides across breakpoints — Header defaults now live in `assets/styles/core-template-part.css`, which reduces `!important` usage and makes responsive changes cleaner.

2026-02-15 — Added native Solutions Slider block pair — Needed a page-width locked, editor-friendly slider with hero-style timer indicators and reusable Flickity setup — New `icts-europe/solutions-slider` + `icts-europe/solutions-slide` blocks ship with custom editor UI, front-end autoplay indicators, and constrained responsive styling.

2026-02-15 — Added decorative animated strands to Solutions Slider wrapper — Needed an initial branded motif matching XD style without adding plugin/code complexity — Implemented lightweight SVG-based pseudo-elements with reduced-motion and mobile/editor fallbacks; can be swapped for final XD-exported strand SVG later.

2026-02-15 — Switched Solutions Slider strands to static (no motion) — Animated motion did not meet design preference — Strands remain as decorative SVG pseudo-elements with the same placement and responsive/editor fallbacks.

2026-02-16 — Team Member single template uses a two-column profile+sidebar block layout — Needed a usable baseline for CPT singles with discoverability of adjacent profiles and cleaner social treatment — `acf/team-member-profile` now renders profile content plus an "other team members" sidebar, with LinkedIn icon output only when the ACF URL exists and brand-tertiary hover transition.

2026-02-16 — Registered Team Member profile UI strings with Polylang and switched block output to `pll__()` fallback — Needed direct per-language editing in Polylang String Translations for labels like "Leadership Team" — Strings now appear under `Theme: Team Member`, while untranslated sites still use theme textdomain defaults.

2026-02-16 — Enqueued Team Member profile stylesheet in block editor and added editor-specific preview polish — Single template preview looked inconsistent in Site Editor — `assets/styles/blocks/team-member-profile.css` is now loaded in editor and includes scoped preview layout rules.

2026-02-16 — Overrode Yoast Team Member archive SEO title/schema naming to remove "Archive" — Default Yoast archive template produced "Management Team Archive - …" in title/OG/schema — Theme now filters Yoast title/OG/Twitter/schema for `team-member` archives to output "Management Team - Site Name", with Polylang-aware label translation.

2026-02-16 — Team Member archive H1 is translated via Polylang string mapping — Block template heading text is static HTML, so direct `__()` output is not available in template markup — Theme now registers `management_team_page_heading` and swaps the archive H1 block text at render time for `team-member` archive requests.

2026-02-18 — Added FAQ Accordion ACF block with product/customer filters and RTL-safe interactions — Needed a reusable front-end FAQ surface with taxonomy filtering across translated FAQ posts and an accessible accordion UI — New `acf/faq-accordion` block renders language-scoped FAQ queries, optional fixed taxonomy scoping per page, client-side filter controls, and subtle open/close animation while keeping all items closed by default.
