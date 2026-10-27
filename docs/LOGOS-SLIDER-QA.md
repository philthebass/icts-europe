# Logos Slider QA: 1.1.30

Date: 27 October 2026. Candidate: the 1.1.30 release commit. Source: `/Users/philipevans/Code/icts-europe`.

## Findings and change

The live Airlines page renders 53 unique customer logos, matching the 53 records returned by the public Airline-category customer API, plus 53 non-interactive duplicates for looping. Local has a different dataset: 56 customers plus duplicates.

On the live page, native lazy loading left images unloaded when their rectangles first entered the visible moving strip in both mobile WebKit and desktop Chromium. The fix sets `loading="eager"` and `decoding="async"` on all customer and partner logo rendering paths. Other page images are unaffected. The 53 unique live logo URLs total 167,189 bytes according to HTTP response Content-Length headers; this is an indicative transfer-size measurement, not a decoded-memory or page-performance benchmark.

## Verification

- PHP lint, repository PHPCS and whitespace checks passed.
- Template fixtures with 53, 13, one and zero customers passed; assertions cover the complete set, duplicate count, links and eager/async image attributes.
- Actual Local WordPress Airlines page: 112/112 image elements loaded before scrolling and decoded successfully in WebKit at 390 × 844 and Chromium at 1440 × 900. Five-second animation samples had no unloaded visible images and no JavaScript errors.
- Browser-local copies of the live page with only the logo loading attributes changed: 106/106 images loaded before scrolling and decoded in both engines; five-second animation samples had no unloaded visible images or JavaScript errors. Production was not modified by these tests.
- Unmodified live mobile WebKit completed a natural autoplay loop in approximately 261 seconds, with all 53 names observed and no unexpected positional jump. The desktop Chromium loop completed in approximately 371 seconds with all 53 names observed and no unexpected positional jump. These full-loop checks measured positions and image state; they do not certify physical-device rendering performance.
- With the cookie panel dismissed and the slider centred in view, separate 20-second live samples recorded unloaded visible images in both engines (8 image/frame observations in WebKit, 6 in Chromium). This confirms that late loading is observable in the visible strip, independently of the cookie overlay.
- Local transactional WordPress regression suite passed, including Search/404 and permission checks, and reported fixture rollback. The successful CLI run used a process-only 512 MB memory limit; earlier runs encountered a transient missing Yoast file during updates and the CLI default 128 MB memory limit.

## Remaining checks

Physical iPhone/iPad acceptance, slow-network behaviour, Site Editor manual checks and a fresh Lighthouse comparison remain outstanding. Desktop WebKit emulation cannot certify physical iOS memory or rendering performance. Test the Airlines and TravelDoc Pro travel providers pages after installation and cache purge. This source was tested through the existing Local symlink; the release ZIP was not installed over that symlink.
