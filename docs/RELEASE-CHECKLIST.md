# Release Checklist

Use this checklist when preparing a new ICTS Europe theme release.

## Steps

1. Open the source repo in VS Code: `/Users/philipevans/Code/icts-europe`.
2. Make all theme and code changes there, not in `/Users/philipevans/Local Sites/iesaero/app/public/wp-content/themes/icts-europe`.
3. If ACF fields changed in WordPress admin, sync the updated `acf-json/` files back into `/Users/philipevans/Code/icts-europe` before releasing.
4. Test the change locally as needed.
5. Bump the version and create the changelog scaffold:
   ```sh
   sh scripts/release-theme.sh 1.0.X YYYY-MM-DD
   ```
6. Fill in the new entry in `CHANGELOG.md`.
7. Review changed files in Source Control.
8. Commit and push from `/Users/philipevans/Code/icts-europe`.
9. Build the release zip:
   ```sh
   sh scripts/build-theme-package.sh
   ```
10. Or, if tagging, build from the tag:
    ```sh
    sh scripts/build-theme-package.sh v1.0.X
    ```
11. Upload the zip from `dist/` to LocalWP or the test server.
12. Replace the existing `icts-europe` theme.
13. Clear cache if needed.
14. Check the affected pages and features.
15. For releases touching templates, navigation, sliders, CTAs, tracking scripts, or SEO/schema output, re-run Lighthouse Accessibility, SEO, and Best Practices checks and compare against `docs/LIGHTHOUSE-AUDIT.md`.

## Important Rules

- Source of truth for code: `/Users/philipevans/Code/icts-europe`.
- Installed/test copy only: `/Users/philipevans/Local Sites/iesaero/app/public/wp-content/themes/icts-europe`.
- Do not edit theme files directly in the LocalWP theme folder.
- Do not upload a GitHub "Download ZIP"; always use the zip from `dist/`.
- If no ACF fields changed in WordPress admin, nothing special is needed for `acf-json/`.
- Keep unresolved Lighthouse Accessibility, SEO, and Best Practices findings visible in `docs/LIGHTHOUSE-AUDIT.md`.

## Short Version

- Edit in `/Users/philipevans/Code/icts-europe`.
- Run the release script.
- Fill in the changelog.
- Commit and push.
- Build the zip.
- Upload from `dist/`.
- Test.
