# Release Checklist

Use this checklist when preparing a new ICTS Europe theme release.

## Steps

1. Open the source repo in VS Code: `/Users/philipevans/Code/icts-europe`.
2. Make all theme and code changes there, not in `/Users/philipevans/Local Sites/iesaero/app/public/wp-content/themes/icts-europe`.
3. If ACF fields changed in WordPress admin, sync the updated `acf-json/` files back into `/Users/philipevans/Code/icts-europe` before releasing.
4. Complete [Pre-release Tests](PRE-RELEASE-TESTS.md) on Local, including the Search/404 regression case, and record results for the candidate.
5. Bump the version and create the changelog scaffold:
   ```sh
   sh scripts/release-theme.sh 1.0.X YYYY-MM-DD
   ```
6. Fill in the new entry in `CHANGELOG.md`.
7. Review changed files in Source Control.
8. Commit the release changes, create the matching version tag and push both `main` and the tag to GitHub.
9. Build the deployable theme ZIP from that tag:
   ```sh
   sh scripts/build-theme-package.sh v1.0.X
   ```
10. Verify ZIP integrity, the `icts-europe/` top-level folder, the packaged version and that the changed files match the tagged source.
11. Upload the ZIP from `dist/` to LocalWP or the test server and replace the existing `icts-europe` theme.
12. Clear caches and check the affected pages and features.
13. For releases touching templates, navigation, sliders, CTAs, tracking scripts, or SEO/schema output, re-run Lighthouse Accessibility, SEO, and Best Practices checks and compare against `docs/LIGHTHOUSE-AUDIT.md`.
14. For releases touching post type routing or translated archive slugs, save **Settings → Permalinks** once, clear cache, and confirm the English and every translated Management Team archive URL return the correct language with a `200` response.
15. Publish a GitHub Release for the pushed tag, with release notes and any outstanding validation clearly recorded. Attach `dist/icts-europe-v1.0.X.zip` as a downloadable release asset. Follow the command example in [Release Workflow](RELEASE-WORKFLOW.md#publish-and-verify-the-github-release).
16. Mark the current stable release as **Latest**. Verify the repository's Releases panel displays the new version, the release is published (not a draft), and the attached theme ZIP is downloadable with the correct filename and contents.
17. Give the user the published release link and the direct theme ZIP download link. Pushing a commit and tag alone does not complete a release.

## Important Rules

- Source of truth for code: `/Users/philipevans/Code/icts-europe`.
- Installed/test copy only: `/Users/philipevans/Local Sites/iesaero/app/public/wp-content/themes/icts-europe`.
- Do not edit theme files directly in the LocalWP theme folder.
- Deploy the packaged theme ZIP from `dist/` or the identical attached GitHub Release asset. Do not use GitHub’s automatically generated source archives.
- If no ACF fields changed in WordPress admin, nothing special is needed for `acf-json/`.
- Keep unresolved Lighthouse Accessibility, SEO, and Best Practices findings visible in `docs/LIGHTHOUSE-AUDIT.md`.

## Short Version

- Edit in `/Users/philipevans/Code/icts-europe`.
- Run the release script.
- Fill in the changelog.
- Commit, tag and push both the commit and tag.
- Build and verify the ZIP from the tag.
- Install and test the packaged theme.
- Publish the GitHub Release and attach the theme ZIP.
- Verify Latest, the visible release version and the downloadable ZIP.
- Share the release and ZIP links.
