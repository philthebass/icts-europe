# Deploy Checklist

Use this checklist when releasing a new version of the ICTS Europe theme to the test or production server.

Source repo: `/Users/philipevans/Code/icts-europe`
Installed LocalWP theme copy: `/Users/philipevans/Local Sites/iesaero/app/public/wp-content/themes/icts-europe`

## Release steps

1. Finish the theme changes in `/Users/philipevans/Code/icts-europe` and check the site in Local.
2. If any ACF field groups were changed in WordPress admin, copy the updated `acf-json/` files back into the source repo.
3. Open Terminal in the source repo folder.
4. Run `sh scripts/release-theme.sh 1.0.2 2026-04-01`.
5. Open `CHANGELOG.md`.
6. Fill in the blank bullets for what changed.
7. In VS Code Source Control, review the changed files.
8. Enter a commit message such as `Release 1.0.2`.
9. Commit and push to GitHub.
10. Optional but recommended: create a Git tag such as `v1.0.2`.
11. Build the server zip:
   - If tagged: `sh scripts/build-theme-package.sh v1.0.2`
   - If not tagging yet: `sh scripts/build-theme-package.sh`
12. Open the local `dist/` folder in the source repo.
13. Find the new zip, for example `icts-europe-v1.0.2.zip`.
14. Upload that zip to LocalWP or the test or production server.
15. Replace the existing `icts-europe` theme with the uploaded version.
16. Clear any cache if needed.
17. Check the key pages on the server.

## Important rules

- Always make theme changes locally first.
- Use `/Users/philipevans/Code/icts-europe` as the source of truth for code and releases.
- Treat the LocalWP theme folder as the installed/test copy only.
- Do not make design, template, or theme edits directly on the test server.
- The test server is for content edits, translations, and testing.
- Upload the zip built from the local `dist/` folder, not a default GitHub “Download ZIP”.
- Do not overwrite the database when deploying a theme update.

## Short version

- Update locally.
- Run the release script.
- Fill in the changelog.
- Commit and push.
- Build the zip.
- Upload the zip.
- Test on the server.
