# Deploy Checklist

Use this checklist when releasing a new version of the ICTS Europe theme to the test or production server.

## Release steps

1. Finish the theme changes locally and check the site in Local.
2. Open Terminal in the theme folder.
3. Run `sh scripts/release-theme.sh 1.0.2 2026-04-01`.
4. Open `CHANGELOG.md`.
5. Fill in the blank bullets for what changed.
6. In VS Code Source Control, review the changed files.
7. Enter a commit message such as `Release 1.0.2`.
8. Commit and push to GitHub.
9. Optional but recommended: create a Git tag such as `v1.0.2`.
10. Build the server zip:
   - If tagged: `sh scripts/build-theme-package.sh v1.0.2`
   - If not tagging yet: `sh scripts/build-theme-package.sh`
11. Open the local `dist/` folder.
12. Find the new zip, for example `icts-europe-v1.0.2.zip`.
13. Upload that zip to the test or production server.
14. Replace the existing `icts-europe` theme with the uploaded version.
15. Clear any cache if needed.
16. Check the key pages on the server.

## Important rules

- Always make theme changes locally first.
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
