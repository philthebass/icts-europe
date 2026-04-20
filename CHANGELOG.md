# Changelog

All notable theme changes should be recorded in this file.

This project uses a simple release format:
- Patch release: fixes and small safe updates, for example `1.0.1` -> `1.0.2`
- Minor release: notable new sections, templates, or features, for example `1.0.1` -> `1.1.0`
- Major release: breaking structural changes only, for example `1.0.1` -> `2.0.0`

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
