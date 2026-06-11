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

All other `patterns/*.php` files remain in source control but are hidden from the editor inserter. They are retained as implementation references or future starting points, not as launch-ready editor choices.

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
