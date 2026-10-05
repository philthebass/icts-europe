# Security maintenance verification

Version 1.1.26, 5 October 2026. The site is already live. This package is for Local verification before a separate production deployment.

## Decisions

- Only users allowed to edit others' published FAQs can reorder; every affected FAQ also requires edit permission.
- Ordering changes only menu_order, leaving content, modification dates and translation relationships intact. Database errors return failure rather than success; reload after an interrupted save.
- Sector Card sizes use theme presets and weights use the approved list. Non-preset legacy sizes are ignored. The Local content audit found no Sector Card instances outside revisions; production content has not been audited.
- Published Customers, Partners, Testimonials, FAQs and their filter taxonomies remain public through REST. These records must not contain confidential editorial notes. Front-end PHP rendering does not technically require public REST access; retaining it is an explicit content policy.
- Theme assets include the existing fallback image, preserving its appearance across environments.

## Automated Local checks

Run scripts/test-security-local.php via WP-CLI eval-file against Local only. It creates temporary fixture rows in a database transaction, confines FAQ queries to those rows, simulates role capabilities without changing user accounts, blocks outbound HTTP/mail during the tests, and rolls back fixture data. It requires an InnoDB posts table and the theme, ACF Pro and Polylang active. Do not run against production.

## Results on 5 October 2026

- PHP syntax checks on all changed PHP files passed.
- The repository PHPCS security/compatibility gate passed.
- All 32 Local regression assertions passed using WordPress 7.1.2, ACF Pro 6.8.10, Polylang Pro 3.8.10 and Yoast 28.6. Fixture transaction rolled back.
- Local's theme folder is already a symlink to the source repository, so the updated source is active locally without replacing that link.
- The initial version 1.1.26 test ZIP was built from a temporary Git index. The release package is rebuilt from tag v1.1.26 after committing the approved changes. Production deployment remains a separate step.
- Automated browser inspection was unavailable because the browser tool could not verify its required access policy. Philip subsequently confirmed the manual Local checks passed, including FAQ dragging after the selector fix and Sector Card testing.

- Follow-up: FAQ drag selectors now support WordPress 7.1 `td.check-column` cells as well as older `th` cells. A visible Move label identifies the drag area.

## Manual Local checks

1. As an Administrator or Editor, filter FAQs by Product and Customer Type, change order, reload and check that it persists. Repeat in English and another language, checking unaffected items retain their relative order.
2. As a Contributor or Author, confirm theme FAQ drag controls are absent and a forged theme reorder request is denied.
3. Confirm FAQ answers containing embeds and forms are unchanged after ordering, including when the editor lacks unfiltered_html.
4. Check Sector Card typography, links, modal content and editor preview. Insert a new card if no saved examples exist.
5. Check FAQ structured data, hero/steps images and related-content fallback imagery.
6. Confirm only the four approved theme patterns appear in the inserter.
7. Check translated pages, header language links, public news filtering and the Latest News Slider.
8. Confirm published supporting REST records still load anonymously; drafts/private records remain protected.

## Operational follow-up before production deployment

- Take a production backup and keep the preceding theme package for rollback.
- Configure and verify any rate limit specifically for the public archive search route at the host/CDN. Do not blanket-throttle all WordPress REST traffic. No host/CDN configuration was changed by this patch.
- Keep display_errors disabled in production; direct-access guards are an additional defence.
- Install the tested version through the existing release workflow and purge LiteSpeed/Bunny caches as appropriate.
- Recheck FAQ ordering, multilingual pages and search after deployment. This task does not deploy to production.
