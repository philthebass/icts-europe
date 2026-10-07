# Pattern Curation

## Summary

The theme keeps the inherited Ollie-style pattern files in the repository for future reuse, but the editor inserter is curated for launch handoff. Only launch-approved ICTS patterns are visible to editors by default.

The allow-list is managed in `get_launch_approved_pattern_slugs()` in `functions.php`.

## Launch-Approved Inserter Patterns

- `icts-europe/benefits` (`patterns/benefits.php`): ICTS benefit section with existing brand-aligned content.
- `icts-europe/icts-card` (`patterns/icts-card.php`): reusable industry, service, or solution card.
- `icts-europe/contact-map-static` (`patterns/contact-map-static.php`): cookie-safe static contact map link.
- `icts-europe/counter-band` (`patterns/counter-band.php`): reusable metrics band using the current counter workflow.

## Retained Legacy Patterns

The `icts-europe/template-page-search` and `icts-europe/template-page-404` patterns must stay registered: the Search and 404 templates render through them. Both declare `Inserter: false`, so they remain hidden from editors. Keep this runtime exception separate from the four-pattern inserter allow-list.

All other `patterns/*.php` files remain in source control but are unregistered and hidden from the editor inserter. They are retained as implementation references or future starting points, not as launch-ready editor choices.

Common reasons for hiding inherited patterns:

- Demo pricing, testimonial, profile, or blog copy.
- Placeholder imagery or generic demo layouts.
- Header, footer, menu, and template-part variants that editors should not insert into normal page content.
- Older Ollie-style layouts that need a design/token review before use.

## Promoting a Pattern Later

Before making a hidden pattern visible:

1. Replace demo copy and placeholder media.
2. Confirm all colors, font sizes, spacing, and classes use current theme conventions.
3. Test the pattern in the Site Editor and front end.
4. Add the slug to `get_launch_approved_pattern_slugs()`.
5. Update this document.

## Test Checklist

- Open the Site Editor inserter and confirm only the approved ICTS patterns appear.
- Insert each approved pattern into a draft page.
- Check mobile and desktop previews.
- Confirm legacy pattern files remain available in the repository for future review.
- Verify search with matches, search with no matches, and a missing URL render their header, main content, and footer.

## Local verification — 7 October 2026 (1.1.27)

- Search `download`: HTTP 200, four results, header and footer present.
- No-match search: HTTP 200 with the no-results message and page structure.
- Category-filtered `download` search (Travel Guide): HTTP 200, one result.
- `travel` search pages 1 and 2: HTTP 200 with results and page structure.
- French search: HTTP 200 with French document language and page structure.
- Missing URL: HTTP 404 with the 404 page content, header and footer.
- All 36 Local transactional regression assertions passed; fixtures rolled back. PHP syntax, PHPCS and whitespace checks passed.
- Browser automation could not start because the workspace root is a symlink. Philip subsequently confirmed Local testing passed on 7 October 2026 and authorized the GitHub release.
- The initial test ZIP was built from a temporary Git index. The production release ZIP is rebuilt from tag `v1.1.27` after committing the accepted changes. Production upload is handled separately by Philip.
