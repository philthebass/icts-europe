# Changelog

All notable theme changes should be recorded in this file.

This project uses a simple release format:
- Patch release: fixes and small safe updates, for example `1.0.1` -> `1.0.2`
- Minor release: notable new sections, templates, or features, for example `1.0.1` -> `1.1.0`
- Major release: breaking structural changes only, for example `1.0.1` -> `2.0.0`

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
