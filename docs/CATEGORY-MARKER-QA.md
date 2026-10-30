# Category marker colour synchronisation

Date: 30 October 2026. Release: `v1.1.33`. **Status: live; category swatches and colour synchronisation confirmed working by Philip.**

## Behaviour

The Marker colour token field uses `icts_category_color_slug` term metadata. The theme registers this key with Polylang’s `pll_copy_term_metas` filter for category-to-category synchronisation and copying. The field description explains that its value is shared.

- Saving any linked language version makes its token the value for the whole translation group.
- Selecting Default (Brand Secondary) clears the token across the group.
- Saving the preferred category version reconciles existing mismatches, even if its selected token is unchanged. There is no automatic bulk migration on installation.
- Polylang term duplication copies the token to a new translation.
- Unrelated categories retain their own colours; category names and unrelated metadata retain their translation rules.
- The categories must be linked as translations in Polylang. Matching names alone do not establish a relationship.

## Local validation

All 24 assertions passed using temporary category fixtures across all nine configured languages. Coverage includes changes from both the first and another language, Default, pre-existing mismatches, unchanged-token saves, updates without the marker field, translation copying, unrelated categories, translated names and unrelated metadata, non-category exclusion and preservation of other sync keys. The fixture transaction was rolled back. PHP syntax, PHPCS and whitespace checks passed.

Run `scripts/test-category-marker-sync-local.php` using WP-CLI `eval-file` against Local only. The script requires the updated theme, Polylang, an administrator, multiple languages and InnoDB taxonomy tables. Use Local’s site shell and a sufficient PHP memory limit.

## Manual acceptance

In Local, open Posts → Categories, edit a translated category and save a different Marker colour token. Open its other language versions and confirm the selected token matches. Repeat from a different language and test Default. Check the marker in the Latest News slider or news archive. Philip confirmed the synchronisation works well in Local. Philip also accepted the new swatch picker and list column on 30 October 2026. This acceptance preceded production deployment.

## Swatch selector and category list

The add/edit category form progressively enhances its native select with a labelled swatch combobox. Each palette choice retains its token name and shows its actual colour; translucent colours use a chequered backdrop and white colours retain a border. The RGB value is available as a tooltip. The native select remains the submitted value and the no-JavaScript fallback. Arrow keys, Home/End, Enter/Space, Escape, Tab and typing a token name are supported.

The Categories list has a Marker colour column immediately after Name, showing the swatch and token name. Default uses Brand Secondary. Existing taxonomy and Polylang language columns are preserved. Assets load only on category add/list/edit admin screens.

Chromium and WebKit tests passed against WordPress-rendered add/edit/list fixtures using the Local theme assets: 31 colour choices including Default, mouse and keyboard selection, type-ahead, Escape cancellation, Tab selection, submitted form values, reset, correct list swatches, mobile popup bounds and no-JavaScript fallback. Screenshots were inspected. These tests use rendered fixtures, not a logged-in browser session. Run `node scripts/test-category-marker-swatches.cjs` after the PHP fixture test; Playwright and its Chromium/WebKit browsers must be installed.

## Release 1.1.33 checks

On 30 October 2026, all 24 category assertions, both browser suites and all 36 WordPress regression assertions passed again for the candidate. Fixture transactions rolled back. PHP/JavaScript syntax, PHPCS and whitespace checks passed. The Local homepage, Search results, no-results and 404 pages rendered their expected content, including headers and footers. Philip accepted both synchronisation and swatches in Local.

The release ZIP was built from `v1.1.33`. Integrity, version, theme folder and tagged runtime contents were verified before publication; the downloaded GitHub asset matched the verified local ZIP. Local uses the existing source symlink, which is preserved. Full navigation, Site Editor and screen-reader checks were not repeated. Production deployment and category checks are recorded below.

## Live deployment and acceptance

- Philip uploaded 1.1.33 to `https://ies.aero/` and cleared caches on 30 October 2026.
- Codex verified the homepage serves version 1.1.33 and that the live stylesheet, swatch JavaScript and swatch CSS match the tagged release files exactly.
- Chromium and WebKit checks using the deployed assets with rendered test forms passed. These were fixture checks, not an authenticated live admin test.
- The live Categories screen required login in Codex’s browser. Philip subsequently checked the actual live Categories screen and confirmed that the swatches and colour synchronisation work correctly. This completes the category feature’s live acceptance.
- Codex did not change live category data during verification.

Full navigation, Site Editor, screen-reader and live Search/404 checks have not been recorded for this deployment and remain separate from the completed category feature checks.
