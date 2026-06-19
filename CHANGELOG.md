# Changelog

All notable theme changes should be recorded in this file.

This project uses a simple release format:
- Patch release: fixes and small safe updates, for example `1.0.1` -> `1.0.2`
- Minor release: notable new sections, templates, or features, for example `1.0.1` -> `1.1.0`
- Major release: breaking structural changes only, for example `1.0.1` -> `2.0.0`

## 1.1.12 - 2026-06-19
### Added
- No new features in this release.

### Changed
- Logos Slider now uses the CSS marquee on iOS/iPadOS WebKit as well as other devices.
- Logos Slider spacing is fluid, with tighter gaps on narrower viewports.
- Logos Slider marquee speed is increased on mobile and phone-sized viewports.

### Fixed
- Restored animated logo movement on iOS without reintroducing Flickity.

### Notes
- After deploying, purge LiteSpeed and Bunny CDN caches, then test the TravelDoc Pro travel providers page on iOS Safari or Chrome.

## 1.1.11 - 2026-06-18
### Added
- No new features in this release.

### Changed
- Counter Band cover images are restored in front-end markup for non-iOS devices.
- The existing iOS/iPadOS WebKit CSS rule still hides Counter Band cover images while stability testing continues.

### Fixed
- Restored the Counter Band visual treatment without reintroducing the image on iOS/iPadOS WebKit.

### Notes
- After deploying, purge LiteSpeed and Bunny CDN caches, then test `/industries/travel-providers/traveldoc-pro-for-travel-providers/` on desktop and iOS Safari or Chrome.

## 1.1.10 - 2026-06-18
### Added
- No new features in this release.

### Changed
- Steps Primary images now prefer WordPress attachment output with responsive image markup and explicit intrinsic dimensions.
- Steps Primary no longer forces eager loading or synchronous image decoding.
- Logos Slider marquee animation is disabled on iOS/iPadOS WebKit while remaining CSS-only elsewhere.
- Decorative bubble backgrounds are disabled on iOS/iPadOS WebKit.

### Fixed
- Reduced iOS layout, decode, and paint work around the Logos Slider to Steps Primary boundary on long product pages.

### Notes
- After deploying, purge LiteSpeed and Bunny CDN caches, then test `/industries/travel-providers/traveldoc-pro-for-travel-providers/` on iOS Safari or Chrome with the Page No Wires template active.

## 1.1.9 - 2026-06-18
### Added
- No new features in this release.

### Changed
- Logos Slider no longer enqueues Flickity or its ticker script; front-end motion is now a lightweight CSS marquee.
- Logos Slider renders 12 source logos plus one non-interactive duplicate set for a seamless loop.
- Steps Primary front-end script is now inert so step cards render in their final state without scroll observers, transforms, or reveal transitions.

### Fixed
- Recovered from the iOS instability introduced by re-enabling the JavaScript logo carousel in 1.1.8.
- Reduced scroll-time JavaScript and image work around the Counter Band, Steps Primary, and Logos Slider sequence on long product pages.

### Notes
- After deploying, purge LiteSpeed and Bunny CDN caches, then test `/industries/travel-providers/traveldoc-pro-for-travel-providers/` on iOS Safari or Chrome with the Page No Wires template active.

## 1.1.8 - 2026-06-18
### Added
- No new features in this release.

### Changed
- Logos Slider now renders a maximum of 24 logo images on the front end to reduce DOM size, image decode work, and memory pressure on long pages.
- Logos Slider initializes the normal Flickity ticker on iOS/iPadOS again, using the smaller rendered logo set instead of the static fallback.
- Counter Band removes decorative cover image markup on the front end when the `icts-counter-band` class is present.

### Fixed
- Reduced late painting at the bottom of the counter band and improved scroll stability before the Logos Slider on the TravelDoc Pro travel providers page.

### Notes
- After deploying, purge LiteSpeed and Bunny CDN caches, then test `/industries/travel-providers/traveldoc-pro-for-travel-providers/` on iOS Safari or Chrome with the Page No Wires template active.

## 1.1.7 - 2026-06-18
### Added
- No new features in this release.

### Changed
- Logos Slider uses a static, six-logo fallback on iOS/iPadOS WebKit instead of initializing Flickity and the continuous ticker.
- Steps Primary renders without scroll-triggered animation on iOS/iPadOS WebKit.

### Fixed
- Reduced iOS crash risk at the counter band to Logos Slider boundary on long product pages.

### Notes
- After deploying, purge LiteSpeed and Bunny CDN caches, then test `/industries/travel-providers/traveldoc-pro-for-travel-providers/` on iOS Safari or Chrome with the Page No Wires template active.

## 1.1.6 - 2026-06-18
### Added
- No new features in this release.

### Changed
- Steps Primary images now render eagerly on the front end so iOS does not repeatedly defer or re-decode them while scrolling through the section.
- Steps Primary uses a lightweight fade-only reveal on iOS/iPadOS WebKit instead of disabling the reveal entirely or using horizontal transforms.

### Fixed
- Reduced visible image reloading and scroll jitter in Steps Primary sections on long iOS pages.

### Notes
- After deploying, purge LiteSpeed and Bunny CDN caches, then test `/industries/travel-providers/traveldoc-pro-for-travel-providers/` on iOS Safari or Chrome with the Page No Wires template active.

## 1.1.5 - 2026-06-18
### Added
- No new features in this release.

### Changed
- Steps Primary reveal effects are skipped on iOS/iPadOS WebKit so step cards remain stable while scrolling back and forth.
- Counter band decorative cover images are suppressed on iOS/iPadOS WebKit to reduce image decode and repaint pressure around long product pages.

### Fixed
- Reduced remaining iOS scroll jitter around the TravelDoc Pro counter band and Steps Primary sections after switching the page to the no-wires template.

### Notes
- After deploying, purge LiteSpeed and Bunny CDN caches, then test `/industries/travel-providers/traveldoc-pro-for-travel-providers/` on iOS Safari or Chrome with the Page No Wires template active.

## 1.1.4 - 2026-06-18
### Added
- No new features in this release.

### Changed
- Counter blocks now render final values immediately on iOS/iPadOS WebKit instead of starting frame-by-frame number animation as the counter band enters view.

### Fixed
- Reduced iOS scroll-time crash risk around counter bands with very large animated values, including the TravelDoc Pro travel providers page.

### Notes
- After deploying, purge LiteSpeed and Bunny CDN caches, then test `/industries/travel-providers/traveldoc-pro-for-travel-providers/` on iOS Safari or Chrome by scrolling from the CTA through the counter band and into the Logos Slider.

## 1.1.3 - 2026-06-18
### Added
- No new features in this release.

### Changed
- The Logos Slider ticker now only animates while the carousel is near or inside the viewport, and stops cleanly while the page is hidden, paused, or off-screen.
- Page wires redraws are now coalesced through `requestAnimationFrame` and skip tiny height-only changes to reduce scroll-time layout work on iOS.

### Fixed
- Reduced iOS WebKit scroll-time crash risk on long pages that combine decorative page wires with large Logos Slider instances.

### Notes
- After deploying, purge LiteSpeed and Bunny CDN caches, then test `/industries/travel-providers/traveldoc-pro-for-travel-providers/` on iOS Safari or Chrome by scrolling through the Logos Slider and FAQ sections.

## 1.1.2 - 2026-06-15
### Added
- No new features in this release.

### Changed
- No general behavior changes beyond Logo Slider partner de-duplication.

### Fixed
- Prevented the Logos Slider from rendering duplicate Partner logos from translated Polylang partner records.

### Notes
- After deploying, purge cache and verify `/about-us/` shows each partner logo once in the "Our partners" Logos Slider.

## 1.1.1 - 2026-06-12
### Added
- No new features in this release.

### Changed
- Scoped the footer Gravity Forms required legend hide rule to all footer Orbital forms so translated signup form IDs inherit the same treatment as the English form.

### Fixed
- Hid the required fields message on translated footer mailing list forms, including the Portuguese footer signup form.

### Notes
- After deploying, purge cache and verify the footer signup form on English plus at least one translated home page, such as `/pt/casa/`.

## 1.1.0 - 2026-06-11
### Added
- Added temporary legacy token compatibility CSS for saved database content while source templates and patterns move to current theme tokens.
- Added structured archive filter REST response data for safer front-end DOM rendering while keeping temporary legacy HTML response fields.
- Added launch pattern curation documentation in `docs/PATTERN-CURATION.md`.
- Added Hero Slide deprecations for older saved slider markup variants to reduce editor recovery prompts during migration.

### Changed
- Loaded front-end utility scripts and styles conditionally based on rendered content instead of globally where possible.
- Limited page wires JavaScript to rendered wires containers while keeping the home page wires treatment.
- Rendered the Hero Slider content panel in saved markup and preloaded key home page font files to reduce mobile layout shift.
- Disabled arbitrary custom font-size entry in the editor so font-size choices stay token-based.
- Curated the Site Editor pattern inserter to a launch-approved ICTS pattern allow-list while retaining inherited pattern files for future reuse.
- Aligned README, docs, and theme metadata around WordPress 6.9.x, PHP 7.3+, GPL v2-or-later licensing, and current dependency notes.

### Fixed
- Migrated undefined legacy color, font, and spacing preset references in source files to current theme tokens.
- Hardened archive filter REST arguments with schemas, sanitization, and validation.
- Removed demo placeholder copy from the approved ICTS card pattern.
- Reduced mobile Hero Slider layout shift caused by late content-panel creation and delayed primary font rendering.

### Notes
- After deploying, hard reload the editor and front end, then verify the home page Hero Slider, page wires, navigation, search modal, language switcher, archive filters, counters, and curated pattern inserter.
- Some existing multilingual home pages may still need one manual Hero Slider block recovery and save because of older translated RichText serialization. Check each language home page once after deployment.
- Keep the temporary legacy token compatibility CSS until production saved content has been audited and resaved.

## 1.0.29 - 2026-06-11
### Added
- Added truthful `operatingSystem` values to canonical solution `SoftwareApplication` schema so Google's Software Apps rich-result parser has the second required property without inventing offer or review data.
- Registered solution `operatingSystem` values in the Polylang `Theme: Solution schema` string group.

### Changed
- No behavior changes beyond the solution schema field addition.

### Fixed
- Resolved the Google Rich Results critical Software Apps issue that required at least two of `offers`, `aggregateRating`, `applicationCategory`, and `operatingSystem`.

### Notes
- After deploying, revisit a canonical solution page, translate/review the new `operatingSystem` strings in `Theme: Solution schema`, purge cache, and retest with Google's Rich Results Test. `offers` and `aggregateRating` may still appear as optional warnings until real pricing/review data exists.

## 1.0.28 - 2026-06-11
### Added
- Added Yoast graph extensions for the six canonical solution pages so TravelDoc ADC, TravelDoc Compliance, TravelDoc Pro, TravelDoc Explore, Global APIS, and CPM emit `SoftwareApplication` schema.
- Registered solution schema metadata under the Polylang string group `Theme: Solution schema` for translation review across the multilingual site.

### Changed
- Linked each canonical solution page `WebPage` schema node to its generated software entity via `mainEntity`, and linked software entities back to the page via `mainEntityOfPage`.
- Matched translated solution pages through their default-language Polylang source slug so schema output does not depend on environment-specific page IDs.

### Fixed
- No bug fixes in this release.

### Notes
- After deploying, visit at least one canonical solution page to register the new Polylang strings, translate/review the `Theme: Solution schema` group in production, and verify one English and one translated solution page include exactly one `SoftwareApplication` node in Yoast JSON-LD.
- Industry-specific solution landing pages intentionally do not emit full `SoftwareApplication` schema in this release.

## 1.0.27 - 2026-06-08
### Added
- Registered legacy `header`, `footer`, `Features`, and `Banners` pattern categories so older theme pattern metadata remains visible in the editor.

### Changed
- Preserved WordPress's open-ended block inserter allow-list when no explicit block restrictions are active.

### Fixed
- Restored theme patterns in the editor by avoiding conversion of `allowed_block_types_all === true` into a fixed registered-block list, which modern WordPress editor builds can use to filter all patterns out of the inserter.
- Targeted the actual legacy ACF counter block name (`acf/counter`) when filtering explicit block allow-lists.

### Notes
- After deploying, purge LiteSpeed, hard reload the editor, and confirm `window.top.wp.data.select('core/block-editor').getSettings().__experimentalBlockPatterns?.length` is greater than `0`.

## 1.0.26 - 2026-06-08
### Added
- Added Yoast graph extensions for Team Member profile pages so published `team-member` singles emit `Person` schema using the profile title, job title, biography, featured image, LinkedIn URL, and existing Organization node.

### Changed
- Linked Team Member profile `WebPage` schema to the generated `Person` node via `mainEntity`.
- Normalized Team Member schema text output by stripping markup, decoding HTML entities, and collapsing whitespace before JSON-LD output.

### Fixed
- No bug fixes in this release.

### Notes
- After deploying, view source on an English and translated Team Member profile and confirm the Yoast JSON-LD graph includes a `Person` node with a localized `@id`, `url`, `jobTitle`, `description`, `worksFor`, and `sameAs` where a LinkedIn profile is set.

## 1.0.25 - 2026-06-08
### Added
- No new features in this release.

### Changed
- Left-aligned the Gravity Forms contact split footer actions to match the form layout.
- Increased the mobile Hero Slider height allowance and tightened narrow-screen panel spacing for longer translated copy.

### Fixed
- Prevented verbose Hero Slider copy from overflowing the slider bounds on narrow mobile screens.
- Kept the Hero Slider content panel inside the viewport by including panel/content padding in width calculations.

### Notes
- After deploying, verify the homepage Hero Slider at 438px, 414px, 390px, and 375px wide using the longer Dutch-style slide copy.
- Check a contact split Gravity Form to confirm footer buttons align correctly.

## 1.0.24 - 2026-06-03
### Added
- No new features in this release.

### Changed
- No behavior changes beyond the scoped Solutions Slider positioning fix.

### Fixed
- Kept Solutions Slider previous and next arrows on opposite sides on Arabic RTL pages by clearing Flickity's opposite-side arrow positioning.

### Notes
- After deploying, verify an Arabic page with Solutions Slider shows one arrow on each side of the slider at desktop widths.

## 1.0.23 - 2026-06-01
### Added
- Documented the editor link picker search and internal URL visibility decisions.

### Changed
- Narrowed default editor link autocomplete suggestions to pages, posts, team members, and categories.
- Kept Customers, Partners, Testimonials, FAQs, Product terms, Customer Type terms, and Country terms available for admin/editor use while disabling their public archive/single URL registration.

### Fixed
- Prevented internal filtering content such as Product term archives from appearing as default Site Editor navigation link suggestions.

### Notes
- After deploying, flush permalinks once and verify URLs such as `/product/traveldoc-compliance/` no longer resolve as public archives.
- Re-test Site Editor navigation link autocomplete for speed and relevance.

## 1.0.22 - 2026-05-29
### Added
- Registered the live Team Member archive intro text for Polylang translation under `Theme: Team Member`.

### Changed
- Team Member archive intro rendering now uses the current saved template copy as its translatable source text.

### Fixed
- Enabled translation of the `Meet the team driving our vision, technology and growth.` archive text on multilingual Team Member archive pages.

### Notes
- After deploying, load wp-admin once, then translate the Team Member archive intro in Polylang String Translations.

## 1.0.21 - 2026-05-29
### Added
- Registered header search modal strings for Polylang translation under `Theme: Header Search`.

### Changed
- Header search modal labels now render through Polylang string translations when Polylang is active.

### Fixed
- Enabled translated header search placeholder, submit label, dialog label, and close label on multilingual pages.

### Notes
- After deploying, load wp-admin once, then translate `Search`, `Search...`, `Site search`, and `Close search` in Polylang String Translations.

## 1.0.20 - 2026-05-29
### Added
- No new features in this release.

### Changed
- Logos Slider global customer queries now resolve Polylang translation groups to their default-language customer record before rendering.

### Fixed
- Prevented duplicate customer logos when a translated page uses Logos Slider with all customer types/products selected.

### Notes
- After deploying, verify `pt/traveldoc-pro/` shows each customer logo once when the Logos Slider is set to show all customers.

## 1.0.19 - 2026-05-29
### Added
- Added Customer Type and Product dropdown filters to the Customers admin list.
- Added source-controlled ACF JSON for the Customers CPT and Countries taxonomy.

### Changed
- Documented the global logo-query behavior and Customers admin filter decision.

### Fixed
- Fixed Logos Slider results on translated Polylang pages by querying shared customer and partner logo records across languages while preserving block filters.

### Notes
- After deploying, verify the Portuguese Ground Handlers page shows the same Ground Handler logos as English.
- Confirm ACF shows Customers and Countries as saved; Events and inactive Subsidiaries can remain out of scope for this release.

## 1.0.18 - 2026-05-27
### Added
- Documented the Steps Primary translation-safe attribute sourcing decision.

### Changed
- Updated Steps Primary and Steps Primary Step block attributes to read translated text and image data from saved markup.

### Fixed
- Prevented Polylang/DeepL-translated Steps Primary blocks from needing recovery and losing translated heading, title, and description text.

### Notes
- After deploying, translate a page containing Steps Primary and confirm the parent block and step blocks open without recovery prompts.

## 1.0.17 - 2026-05-27
### Added
- Registered the Latest News Slider default heading (`Latest news`) as a Polylang string under `Theme: Archive`.

### Changed
- No broader behavior changes in this release.

### Fixed
- Enabled the default Latest News Slider heading to be translated through Polylang string translations.

### Notes
- After deploying, load wp-admin once and translate `Latest news` in Languages -> String translations -> Theme: Archive.

## 1.0.16 - 2026-05-27
### Added
- No new features in this release.

### Changed
- No broader behavior changes in this release.

### Fixed
- Kept footer navigation visible as plain links on mobile and centered the ISO certification logos on narrow screens.

### Notes
- Verify footer utility links and ISO logos on mobile after deploying the `1.0.16` package.

## 1.0.15 - 2026-05-27
### Added
- No new features in this release.

### Changed
- Throttled desktop mega-menu scroll positioning so layout work only runs once per animation frame.

### Fixed
- Prevented mobile Safari reloads/crashes by skipping desktop mega-menu positioning work during mobile page scroll.

### Notes
- Validate mobile scrolling and hamburger navigation on iOS Safari after deploying the `1.0.15` package.
- Spot-check the desktop mega menu at the 1093px/1094px breakpoint and wider desktop widths.

## 1.0.14 - 2026-05-27
### Added
- No new features in this release.

### Changed
- No broader behavior changes in this release.

### Fixed
- Prevented Solutions Slider frames from inheriting parent text color as visible border, outline, or shadow chrome while preserving inherited text color inside dark sections.

### Notes
- Validate Solutions Slider instances inside dark parent groups where parent text color is set to white after deploying the `1.0.14` package.

## 1.0.13 - 2026-05-27
### Added
- No new features in this release.

### Changed
- Added a responsive white background and token padding to the Steps Primary heading below 1321px so decorative page wires do not reduce heading readability.

### Fixed
- No bug fixes in this release.

### Notes
- Validate the Steps Primary block on pages using decorative page wires at tablet and narrow desktop widths after deploying the `1.0.13` package.

## 1.0.12 - 2026-05-22
### Added
- Added a `has-white-background-below-1321` utility class for improving page-wire hero readability on narrower screens.

### Changed
- No broader behavior changes in this release.

### Fixed
- No bug fixes in this release.

### Notes
- Apply `has-white-background-below-1321` to hero/content groups where decorative page wires reduce text readability below 1321px.

## 1.0.11 - 2026-05-03
### Added
- No new features in this release.

### Changed
- Extended horizontal overflow clipping to the hero slider wrappers and horizontal strands page context so decorative full-width sections do not create sideways scroll.
- Added matching nested mega-menu hover and focus-within background styling for deeper desktop flyout rows.

### Fixed
- Prevented the Steps Primary decorative strands area from contributing to page-level horizontal overflow.

### Notes
- Validate pages using the Hero Slider, Steps Primary, `section-strands-bg-horizontal`, and the desktop mega menu after deploying the `1.0.11` package.

## 1.0.10 - 2026-04-29
### Added
- No new features in this release.

### Changed
- Sped up the desktop mega menu panel transition from 1 second to 320ms, matching the existing desktop flyout timing.
- Balanced the desktop mega menu flyout row spacing so hover states have matching right-side breathing room.

### Fixed
- Prevented the horizontal strands section helper from creating page-level horizontal overflow while keeping the decorative strands visible around constrained groups.

### Notes
- Validate pages using `section-strands-bg-horizontal` and the desktop mega menu after deploying the `1.0.10` package.

## 1.0.9 - 2026-04-29
### Added
- No new features in this release.

### Changed
- Updated feature-card title styles so industry and USP card titles use the theme `x-large` font-size, bold font-weight, and snug line-height tokens.

### Fixed
- No bug fixes in this release.

### Notes
- Validate feature-card title sizing and card heights on the affected pages after deploying the `1.0.9` package.

## 1.0.8 - 2026-04-20
### Added
- No new features in this release.

### Changed
- Updated the Counter Band editor preview so the block uses a stable equal-column layout while editing, including the initial unselected state.
- Updated Counter block previews in the editor to show the stored formatted value immediately instead of the animated starting value.

### Fixed
- Prevented Counter Band cards from inheriting front-end asymmetric span rules that caused distorted layouts in the block editor.

### Notes
- Validate the Counter Band in the editor after deploying the `1.0.8` package, including the initial unselected state and the displayed counter values.

## 1.0.7 - 2026-04-20
### Added
- No new features in this release.

### Changed
- Removed the Solutions Slider intro width cap so section introductions can use the available layout width.
- Updated feature-card icon selectors and title height handling so USP and icon-aligned card layouts behave more consistently with the current block markup.

### Fixed
- Prevented the header nav from showing both `Industries` and `Solutions` as selected when the shared TravelDoc airline page is active from both navigation trees.

### Notes
- Validate the TravelDoc airline page header state, the Solutions Slider intro layout, and feature-card icon/title alignment after deploying the `1.0.7` package.

## 1.0.6 - 2026-04-17
### Added
- Added Testimonials Slider block controls for filtering slides by `customer-type`.
- Added FAQ Accordion controls for limiting the initial FAQ count and customizing the front-end `Show all FAQs` button label.
- Added FAQ admin taxonomy filters and filtered list reordering support for managing FAQ order by `product` and `customer-type`.
- Added `ICTS Bullets` and `ICTS Bullets Light` list styles.

### Changed
- Updated the FAQ Accordion front-end behavior so search and taxonomy filtering work against the full matching set before optionally collapsing the remainder behind a reveal button.
- Updated the testimonials query and related ACF objects so testimonials can share the `customer-type` taxonomy used elsewhere in the theme.

### Fixed
- Prevented decorative page-wire and strand background art from leaking into block style preview tiles in the editor.
- Improved FAQ block preview initialization so accordion behavior and preview messaging stay accurate inside ACF block previews.

### Notes
- Validate FAQ filtering, FAQ ordering, Testimonials Slider customer-type filtering, and list style previews after deploying the `1.0.6` package.

## 1.0.5 - 2026-04-15
### Added
- No new features in this release.

### Changed
- Updated the counter band affix text so prefixes and suffixes use the same size and line-height as the counter label.

### Fixed
- Corrected an accidental industry feature-card selector typo in the theme stylesheet.

### Notes
- Validate the counter band on Local and the test server after deployment, especially counters using prefix or suffix text.

## 1.0.4 - 2026-04-13
### Added
- Added a clear-search control to the FAQ accordion filters so visitors can reset search terms with one click.

### Changed
- Refined industry feature-card title and body alignment so cards present more consistently across varying content lengths.

### Fixed
- Fixed the Hero Slider full-width breakout so slide images stretch edge-to-edge more reliably in constrained layouts, including the reported Windows 10 / Edge case.

### Notes
- Validate the Hero Slider and FAQ search controls after deployment, then clear any front-end cache if the previous layout persists.

## 1.0.3 - 2026-04-13
### Added
- Theme-level Yoast breadcrumb separator override to keep the front-end breadcrumb glyph consistent across translated pages and templates.

### Changed
- Yoast breadcrumbs now always render the `»` separator instead of relying on translated plugin option values.

### Fixed
- Resolved inconsistent breadcrumb separators where some translated contexts showed a curly quote character instead of `»`.

### Notes
- Clear caches after deployment if translated archive or template breadcrumbs continue showing the previous separator.

## 1.0.2 - 2026-04-07
### Added
- Theme-level Yoast breadcrumb filtering for hierarchical pages whose ancestors exist only to preserve clean nested URLs.

### Changed
- Breadcrumb trails now omit empty parent pages while keeping the underlying page URLs unchanged.

### Fixed
- Removed unwanted `Industries`, `Airlines`, and similar empty ancestor items from Yoast breadcrumbs on nested solution and industry pages.

### Notes
- Deploy this release to test without overwriting editorial content or permalink structure.

## 1.0.1 - 2026-04-01
### Added
- Introduced a documented release workflow for versioning and test-server deployments.

### Notes
- GitHub is the source of truth for theme code.
- The test server is the source of truth for content, translations, and QA.
