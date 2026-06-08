# Changelog

All notable theme changes should be recorded in this file.

This project uses a simple release format:
- Patch release: fixes and small safe updates, for example `1.0.1` -> `1.0.2`
- Minor release: notable new sections, templates, or features, for example `1.0.1` -> `1.1.0`
- Major release: breaking structural changes only, for example `1.0.1` -> `2.0.0`

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
