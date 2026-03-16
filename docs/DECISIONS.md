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

2026-02-18 — Added FAQ Accordion ACF block with taxonomy scoping, schema output, and RTL-safe interactions — Needed a reusable front-end FAQ surface that can be reused across pages/languages with consistent SEO markup — New `acf/faq-accordion` block renders language-scoped FAQ queries, supports optional fixed Product/Customer Type scoping per page, outputs FAQPage JSON-LD per block instance, and keeps all accordion items closed by default with subtle open/close animation.

2026-02-20 — Added reusable Counter ACF block with lightweight viewport-triggered JS animation — CSS-only integer animation support is inconsistent across target browsers — New `acf/counter` block supports number/direction/label/prefix/suffix controls, renders with semi-transparent brand-primary background + radius, and animates reliably using IntersectionObserver + requestAnimationFrame with reduced-motion handling.

2026-02-20 — Added `x-large` typography token and updated counter presentation defaults — Counter labels needed a larger semantic size token and consistent affix rendering — Theme now exposes `--wp--preset--font-size--x-large`, counter labels use it at 700 weight, counter background is 70% brand-primary transparency, and row/column spacing behavior is normalized for counter blocks.

2026-02-20 — Added `brand-primary-light` token and applied it to counters — Needed a lighter branded counter treatment while keeping reusable card behavior in editor layouts — Counter cards now use 70% transparent `brand-primary-light`, and counter blocks stretch to equal height when used inside Row/Grid/Columns containers.

2026-02-20 — Added reusable Counter Band pattern and container-aware counter typography — Counter cards needed a predictable full-width section wrapper and better handling of large values in narrow cards — New `icts-europe/counter-band` pattern provides a background-image band with responsive counter grid, and counter value sizing now scales by card width to prevent overflow.

2026-02-22 — Made Hero/Solutions native blocks translation-safe by sourcing translatable fields from saved HTML — Polylang/DeepL translations changed visible text while unsourced attributes still held original values, triggering block validation errors — Hero CTA label/URL/target and Solutions intro heading/subheading now parse from block markup, reducing “unexpected or invalid content” on translated pages.

2026-02-22 — Upgraded native Hero/Solutions block registrations to `apiVersion: 3` — WordPress 6.9 warns on API v1/v2 custom blocks for iframe editor compatibility — Theme-owned JS blocks now align with current block API expectations; plugin-owned warnings remain external.

2026-02-22 — Added inspector preview toggles and restored Solutions strands in editor — Preview mode needed a reliable way to exit in Site Editor and design parity required visible strands while editing — Hero/Solutions sliders now expose `Preview first slide only` in inspector, preview no longer suppresses all interactions, and Solutions decorative strands are rendered in editor.

2026-02-23 — Scoped editor-only slider CSS for iframe editor compatibility — After moving native blocks to `apiVersion: 3`, editor canvas rules keyed to `.block-editor-page` no longer matched reliably inside iframe contexts — Hero/Solutions preview and strands editor rules now target both `.block-editor-page` and `.editor-styles-wrapper`, and preview-hide logic uses sibling selectors so only non-first slides are hidden.

2026-02-23 — Versioned Hero editor stylesheet by filemtime — Theme-version cache keys delayed editor CSS updates during rapid block iteration — Hero editor styles now invalidate immediately after file edits, matching other block/editor asset versioning.

2026-02-23 — Added nested navigation flyouts and hierarchical mobile submenu drawers — Industries/Solutions/Company now require second-level submenu flyouts on desktop and parent-aware drawer navigation on mobile — Desktop child flyouts open horizontally from the main mega panel with mirrored RTL positioning, and mobile Back now returns to the immediate parent panel instead of jumping to root.

2026-02-27 — Enabled class-based submenu icons in mobile navigation drawers — Icon classes (`nav-icon-*`) were already used for desktop mega menu rows and needed parity in mobile for consistent IA cues — Mobile drawer row content/toggles now render the same mask-based icon pseudo-elements, so one menu item class setup works across desktop and mobile.

2026-02-27 — Standardized desktop third-level flyout placement and prevented submenu label wrapping — Deeper menu drawers must remain predictable as editors add more nested links under Industries/Solutions — Third-level flyouts now always anchor to a fixed right-side column from the first submenu panel, and submenu labels use no-wrap styling to avoid broken line wraps at narrower desktop widths.

2026-02-27 — Enabled Polylang `Custom fields` synchronization for FSE translation workflows — Header/navigation and other block-based translated entities were not consistently duplicating/copying related metadata during language creation — Keeping `Languages → Settings → Synchronization → Custom fields` enabled is now a required project setting to support reliable translated menu/template behavior.

2026-02-27 — Enabled editor margin/padding controls via theme settings with spacing token guardrails — Editors needed per-block spacing controls (margin/padding) without opening unrestricted custom values — `settings.appearanceTools` is now enabled and `settings.spacing.margin/padding` are true, while `customSpacingSize` remains false so spacing remains token-based.

2026-02-27 — Scoped flow-spacing resets for Hero Slider, Solutions Slider, and Counter Band wrappers — Enabling global margin/padding tools exposed inherited flow spacing side effects on full-width custom blocks — Added targeted wrapper-level `margin-block` resets in block CSS so those components keep their intended geometry while editor spacing tools remain enabled globally.

2026-02-27 — Aligned global button typography with header CTA baseline — Header navigation CTA intentionally uses smaller, regular-weight button text and other buttons should visually match by default — `styles.elements.button` now uses `font-size: small` and regular weight token in `theme.json`, while keeping existing button padding values.

2026-02-27 — Implemented new native Sector Grid/Sector Card blocks using no-build JS + plain CSS assets — Theme’s existing native block pipeline registers browser-ready scripts from `assets/blocks/*` and styles from `assets/styles/blocks/*` without SCSS compilation — New blocks follow the same runtime pattern and are registered via `register_block_type_from_metadata`.

2026-02-27 — Tuned Sector Grid/Card editor controls for predictable content design — Editors requested fewer container spacing overrides plus flexible card typography controls — Sector Grid now relies on default spacing (no custom spacing controls) and exposes core layout/grid controls, while Sector Card now supports heading element switching (`h2`–`h6`/`p`) and configurable heading/body font size and weight.

2026-03-04 — Made footer copyright year dynamic at render time — Footer template-part content in Site Editor and theme files contained hardcoded years — Added render filter for footer copyright paragraph (`Site By EarlyMarketing.com`) to replace `© YYYY` with current year automatically, plus reusable `[icts_current_year]` shortcode.

2026-02-27 — Constrained Sector Card font-size controls to theme preset tokens — Free-text size inputs were too open-ended for editor consistency — Heading/body font size controls now use preset dropdowns (theme token slugs), with frontend mapping to `--wp--preset--font-size--*` variables and backward compatibility for existing legacy values.

2026-02-27 — Locked Sector Grid container layout to grid-only defaults — Editors should not switch card container layout types and break card alignment patterns — Sector Grid now disables layout editing/switching at container level, defaults to `type: grid`, and sets default `minimumColumnWidth` to `20rem` while preserving child grid item positioning controls.

2026-02-27 — Expanded Sector Card modal authoring controls — Modal body composition needed to be less restrictive and card-level visual treatment needed configurable modal surfaces — Removed modal InnerBlocks allowlist (layout/content blocks now unrestricted) and added per-card modal background color setting rendered on the frontend modal panel.

2026-02-27 — Added Sector Card modal starter layout actions — Editors needed faster modal authoring with reusable structures instead of building every modal from scratch — Sector Card editor now provides one-click modal templates (`Simple`, `2 Column`, `Feature List`) that replace modal InnerBlocks content with structured starter blocks.

2026-02-27 — Restricted Sector Card modal background control to theme palette tokens — Modal visuals should remain on-brand and avoid arbitrary ad hoc colors — Modal background now uses a theme-color slug selector only (no free color picker), with default set to `brand-primary-hover` and frontend rendering through `--wp--preset--color--{slug}`.

2026-03-02 — Added native How It Works timeline block pair with interactive step rail — Product pages need an editable, reusable 3-step process component before final design handoff — New `icts/how-it-works` + `icts/how-it-works-step` blocks provide editor-managed heading/intro/steps and front-end click+keyboard step activation with progressive timeline rail styling.

2026-03-02 — Added optional `Horizontal Stepper` style variation for How It Works — Needed a second visual option before final design delivery without changing content model — `icts/how-it-works` now exposes a block style variation that switches timeline rail/panel layout to a desktop horizontal presentation while keeping existing mobile behavior.

2026-03-02 — Temporarily enabled global border-radius controls in editor — Needed short-term visual tuning flexibility for selected layouts before launch lock-down — `settings.border.radius` is now `true`; plan is to switch it back to `false` before production handoff.

2026-03-06 — Added dynamic Latest News Slider block with category color token support — Needed a reusable post-driven card slider matching existing hero/solutions interaction patterns — New `icts/latest-news-slider` renders latest posts server-side with linked cards, grouped Flickity slides + indicators, Yoast-primary-category fallback logic, and category marker colors sourced from category term meta token slug (`icts_category_color_slug`).

2026-03-06 — Aligned Latest News Slider UX with Hero/Solutions preview and indicator behavior — Editors needed parity controls and users needed visible autoplay progress feedback — Added `Preview first slide only` toggle (inspector + block toolbar) for editor, plus autoplay indicator fill animation with hover-pause, no-autoplay fallback, and reduced-motion handling.

2026-03-14 — Team Member archive cards switched to ACF `biog` first paragraph with fallback trim and profile CTA — Design required richer preview copy than fixed short excerpts while keeping card heights stable across roles/translations — Team cards now read `biog` (first paragraph when available), fall back to trimmed text, use updated heading/role type scale, tightened name→role spacing, and keep a consistent `View profile` CTA layout.

2026-03-14 — Post archive template enhanced with theme-styled filter controls and primary-category card metadata — News/blog archive needed XD-aligned cards, filtering UX, translation support, and parity across archive contexts — Added enhanced archive UI (search + category filter), primary category marker treatment, translated labels/date handling hooks, right-aligned compact controls, and pagination restyle; behavior is applied consistently to index/category/tag archives.

2026-03-14 — Archive title localization delegated to dynamic Archive Title block instead of static heading text — Static H1 in Index template could not reliably follow per-language posts page naming in Polylang — Archive title now resolves from queried object at render time; editors should style the `Archive Title` block (not hardcoded heading) and persist visual tweaks via Create Block Theme save-to-theme workflow.

2026-03-14 — Added optional Team Member author override for single posts via ACF post-object field — Editorial workflow needs author card display independent from WP users while preserving safe fallback behavior — Single post template now renders `icts-europe/post-author-card`; it checks `display_author_team_member` (`team-member`), outputs Team Member card (`featured image`, `name`, `job_title`, article date, “Written by:”), and silently falls back to WP author name + article date if unset or invalid/deleted.

2026-03-14 — Updated single-post author override layout to right sidebar with render-time-safe fallback — XD requires author metadata in a sidebar card and fallback behavior must remain robust when override data is missing or deleted — `template-post-centered` now uses a content/sidebar column layout with `icts-europe/post-author-card` in the right column; fallback output is simplified to author name + localized post date only, and role lookup prefers ACF `job_title` with post-meta fallback.

2026-03-16 — Reused Team Member author override across archive cards and Latest News Slider — Author attribution needed to stay consistent with single-post override when editors pick a Team Member in post edit screen — Added reusable `get_post_display_author_name()` helper; archive card renderer and Latest News Slider now resolve author name via `display_author_team_member` first, then silently fall back to WP post author if unset/invalid/deleted.

2026-03-16 — Linked overridden author names to Team Member profiles in archive cards and Latest News Slider — Author override now needs parity with single-post sidebar behavior where selected Team Member names navigate to profile pages — Added `get_post_display_author_data()` helper and updated archive/slider renderers to output linked author names only when a valid Team Member override exists; default WP author fallback remains unlinked.

2026-03-16 — Added related-post variant of Latest News Slider for single post template — Single post pages need a reusable “Related articles” slider driven by post categories while excluding the current post — `icts/latest-news-slider` now supports `relatedByCurrentPost`; when enabled on singular posts it queries by current post categories and excludes the current post ID, and the single template appends this block at the bottom with heading “Related articles” (registered for Polylang translation).

2026-03-16 — Wired Solutions Slider wrapper to `useBlockProps` so align controls render/apply — Block supports declared `align` but wrapper props were not passed through editor/save wrappers, so alignment UI/classes were inconsistent in Site Editor — `assets/blocks/solutions-slider/editor.js` now uses `useBlockProps` in `edit` and `useBlockProps.save` in `save`, restoring expected wide/full alignment controls and class output.
