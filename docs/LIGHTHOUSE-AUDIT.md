# Lighthouse Audit Notes

Baseline report:
- URL: `https://ies.aero/`
- Lighthouse: `13.0.2`
- Captured: `2026-06-12T11:24:32.688Z`
- Categories in scope: Accessibility, SEO, Best Practices

## Current Scores

- Accessibility: `89`
- SEO: `92`
- Best Practices: `81`

## Priority Fixes

### Accessibility

1. Off-screen slider links remain focusable while their parent slide is `aria-hidden`.
   - Affected areas: Hero Slider, Solutions Slider, Client Logos Slider, Latest News Slider.
   - Lighthouse audit: `aria-hidden-focus`.
   - Likely cause: Flickity sets `aria-hidden="true"` on inactive cells, but nested links keep their default tab order.
   - Suggested fix: when slider selection changes, set inactive-slide focusable descendants to `tabindex="-1"` and restore the previous tab state for active slides. Apply the helper across all Flickity-backed theme sliders.

2. Hero Slider indicator buttons use `role="tab"` without a `tablist` parent.
   - Affected area: Hero Slider indicators.
   - Lighthouse audit: `aria-required-parent`.
   - Suggested fix: either add `role="tablist"` to the indicator wrapper and complete the tab pattern, or remove tab semantics from the buttons and keep them as labelled slide controls.

3. Language switcher visible label does not match its accessible name.
   - Affected area: header Polylang language switcher.
   - Lighthouse audit: `label-content-name-mismatch`.
   - Current visible label: current language, for example `English`.
   - Current accessible name: `Language selector`.
   - Suggested fix: include the visible language text in the accessible name, for example `English language selector`.

4. Some links have no discernible accessible name.
   - Affected areas: Hero Slider empty external TravelDoc link, Client Logos Slider logo links where the image/alt output is empty or hidden, footer LinkedIn icon link.
   - Lighthouse audit: `link-name`.
   - Suggested fix: add meaningful link text or `aria-label` values at render time. Icon-only links must always receive a label.

### SEO

1. Generic `Learn more` links are flagged as non-descriptive.
   - Affected links:
     - `/solutions/traveldoc-adc/`
     - `/solutions/traveldoc-compliance/`
     - `/solutions/global-apis/`
     - `/solutions/cpm/`
   - Lighthouse audit: `link-text`.
   - Suggested fix: make the visible text specific where design allows, for example `Learn more about TravelDoc ADC`. If the visible label must stay short, add screen-reader-only context inside the link.

### Best Practices

1. LinkedIn Insight script uses a deprecated browser API.
   - Affected script: `https://snap.licdn.com/li.lms-analytics/insight.old.min.js`.
   - Lighthouse audit: `deprecations`.
   - Suggested fix: confirm where the LinkedIn tag is injected, update it to the current LinkedIn Insight implementation if available, or remove/disable it when not required for launch analytics.

## Regression Checks

- Re-run Lighthouse against the same page after fixes and compare the three scores above.
- Keyboard-test all sliders:
  - Tab order should enter only visible/active slide content.
  - Indicator controls should be reachable and announced correctly.
  - Reduced-motion users should not get autoplay motion.
- Check header language switcher with keyboard and screen reader labels.
- Confirm footer social links and logo links have accessible names.
- Confirm solution CTA links are descriptive in visible text or screen-reader text.

## Implementation Notes

- Keep fixes in the source repo: `/Users/philipevans/Code/icts-europe`.
- Do not patch generated production HTML directly.
- Slider fixes should be implemented in the shared slider JS pattern where possible, then verified across each block-specific script.
- Content/editor fixes, such as footer icon labels or CTA wording, should be recreated locally and saved back into theme files when they affect templates or template parts.
