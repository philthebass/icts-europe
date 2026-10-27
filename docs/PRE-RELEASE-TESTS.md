# Pre-release tests

Use this checklist for each theme release before production upload. Record results against the exact candidate version and commit. Run the baseline checks for every release; add the relevant checks for changed features. An HTTP 200 response alone is not a pass: inspect the rendered page content.

## Test record

Copy this record into the release's QA notes. Use Pass, Fail, Not run, or Not applicable (with a reason); do not mark an unavailable browser check as passed.

- Version / commit / tag:
- Tester / date:
- Local URL / WordPress / PHP / relevant plugin versions:
- Desktop browser / mobile viewport:
- Test IDs and results, evidence links, failures and follow-ups:
- ZIP filename / source tag / package verification:
- Manual acceptance / remaining deployment checks:

## Preparation

- [ ] Review the changes and changelog; identify affected templates, blocks and plugins.
- [ ] Confirm Local is running the candidate source from `/Users/philipevans/Code/icts-europe`. Preserve the existing LocalWP theme symlink and edit through the source path.
- [ ] Use Local content with known matching searches, multiple result pages and a translated page. Record the chosen terms/categories; result counts can change with content.
- [ ] Hard reload and clear relevant caches before checking the candidate.

## Baseline checks — every release

| ID | Check | Expected result |
| --- | --- | --- |
| BASE-01 | Open the homepage, a normal page, a news post and an archive, logged out. | Each renders its intended header, main content and footer; no blank sections or visible PHP errors. |
| BASE-02 | Exercise header navigation, search trigger and language switcher on desktop and mobile. | Links and controls work; keyboard focus is visible; menus/dialogs can be closed. |
| BASE-03 | Open a translated page and use its language switcher. | Correct destination language and URL; expected content and layout. |
| BASE-04 | Open the Site Editor and preview Search, 404 and an affected template without saving incidental edits. | Templates render without unexpected block errors. |
| REG-SEARCH-404 | Complete the regression case below. | Search, no-results and 404 views remain usable; editor pattern curation stays intact. |

## REG-SEARCH-404 — preserve template patterns

**History:** Release 1.1.26 corrected pattern-name handling in the allow-list, activating an older rule that also unregistered patterns required by Search and 404. Both templates then rendered empty. The earlier test incorrectly required only the four editor patterns to remain registered. Release 1.1.27 preserves the two runtime patterns and adds rendering assertions.

Run this case every release, including security releases. It is particularly relevant to changes in `functions.php`, patterns, templates and editor restrictions.

| Step | Action | Expected result |
| --- | --- | --- |
| 1 | Open `https://iesaero.local/?s=download` logged out. | HTTP 200; search heading, controls, matching linked results, header and footer. The brochure page is a known match in the October 2026 Local dataset. |
| 2 | Open `https://iesaero.local/?s=icts-no-match-20261007` (change the term if it gains a match). | HTTP 200; visible no-results message, search controls, header and footer. |
| 3 | Select a category in search results, then return to All categories. | Term and selected category are preserved correctly; results narrow and then recover. No blank page. |
| 4 | Search for a term with multiple pages (for example `travel`), open page 2, then return. | Correct pagination state and different results; search term and any selected filter persist. |
| 5 | Submit a search using the header search dialog on desktop and mobile; repeat a search in another active language. | Dialog and submission work, results layout fits the viewport, and the destination uses the selected language. |
| 6 | Open `https://iesaero.local/icts-pre-release-missing-page/` (use a different nonexistent path if needed). | HTTP 404 with the designed 404 content, header and footer. A blank 404 response fails. |
| 7 | Inspect the theme patterns in the Site Editor inserter. | Only the approved theme patterns in [Pattern Curation](PATTERN-CURATION.md) are offered. Search and 404 runtime patterns are hidden. Plugin/core patterns are outside this allow-list. |
| 8 | Run the Local regression suite below. | Required Search/404 patterns are registered with `inserter: false`; both templates render main content, header and footer; only approved theme patterns are visible in the inserter. |

**Pass condition:** All applicable steps pass. Hiding a pattern from editors must not remove a template dependency from the runtime registry. Check actual output as well as registry membership.

## Automated checks

Run from the source repository using a compatible PHP runtime:

```sh
git diff --check
php -l functions.php
php -l scripts/test-security-local.php
vendor/bin/phpcs
```

Also lint any other changed PHP files. From Local's site shell, run:

```sh
wp --path="/Users/philipevans/Local Sites/iesaero/app/public" eval-file "/Users/philipevans/Code/icts-europe/scripts/test-security-local.php"
```

The suite requires the active theme, ACF Pro, Polylang, an administrator and an InnoDB posts table. It creates transactional fixtures and rolls them back; run it on Local only. Confirm every assertion passes and the rollback message appears. Version 1.1.27 has 36 assertions; future additions may increase that count. See [Security Local Tests](SECURITY-LOCAL-TESTS.md) for coverage and constraints. Automated assertions supplement the browser checks above.

## Checks for affected features

- [ ] `theme.json` or global styles: hard reload the front end and Site Editor; verify typography, colours, spacing and `--wp--preset--*` variables.
- [ ] Sliders, navigation, CTAs or tracking: keyboard-test affected controls, reduced motion and mobile layouts; follow [Lighthouse Audit](LIGHTHOUSE-AUDIT.md) and record any score changes.
- [ ] FAQ ordering, permissions, Sector Cards or REST changes: complete the relevant manual cases in [Security Local Tests](SECURITY-LOCAL-TESTS.md).
- [ ] Translated routes or archive slugs: follow the permalink and all-language archive checks in [Release Checklist](RELEASE-CHECKLIST.md).
- [ ] ACF/editor changes: verify saved content and previews; sync resulting `acf-json/` changes before packaging.

## Package and handoff

- [ ] Resolve failures and record any untested checks before accepting the candidate.
- [ ] Confirm `style.css`, changelog and release tag versions agree; build with [Release Workflow](RELEASE-WORKFLOW.md).
- [ ] Verify ZIP integrity, the `icts-europe/` top-level folder and that packaged changed files match the tagged source. Use the generated theme ZIP rather than GitHub's source archive.
- [ ] For installation testing, use a disposable Local/test copy; preserve the existing development symlink and editorial database. Record separately whether the ZIP was installed or only its contents verified.
- [ ] Record manual acceptance and keep production upload as a separate step. After upload/cache purge, repeat the basic page, Search and 404 smoke checks.
