# DECISIONS — ICTS Europe Theme

Format: YYYY-MM-DD — Decision — Context — Consequences

2026-02-04 — Heading size slugs use h-1..h-6 — WP generates hyphenated CSS variables; aligning slugs and references prevents 16px fallback — Theme JSON and styles now consistent.

2026-02-04 — Added x-small and large font-size presets — CSS referenced these sizes; defining them avoids var() fallbacks — Editor and front end consistent.

2026-02-04 — Added color tokens base/main/secondary/tertiary/border-light — Patterns and CSS reference these tokens — Variables now resolve on front end and editor.

2026-02-04 — Renamed brand-terciary → brand-tertiary — Correct spelling and consistent naming — Audit content for old slug; add temporary alias if needed.

2026-02-04 — Standardized stylesheet handle (icts-europe) and moved inline CSS to wp_add_inline_style — Predictable enqueue and safer output — Dependencies can inline to this handle.

