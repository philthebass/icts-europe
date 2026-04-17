# ICTS Europe Theme Workflow

## Project paths

- Source repo: `/Users/philipevans/Code/icts-europe`
- LocalWP installed theme: `/Users/philipevans/Local Sites/iesaero/app/public/wp-content/themes/icts-europe`

## Core rule

- Edit theme code only in the source repo.
- Treat the LocalWP theme folder as the installed/test copy only.
- Build release zips from the source repo and upload those to LocalWP, test, or production.

## Daily working workflow

1. Open `/Users/philipevans/Code/icts-europe` in VS Code.
2. Make and test code changes there.
3. If you use the Site Editor locally for design work, save those changes back into theme files with Create Block Theme.
4. If ACF field groups were changed in WordPress admin, sync the resulting `acf-json/` updates back into the source repo.
5. Review changed files.
6. Commit and push from the source repo.

## Release workflow

1. Open the source repo:
   - `/Users/philipevans/Code/icts-europe`
2. Run the release helper:
   ```sh
   sh scripts/release-theme.sh 1.0.X YYYY-MM-DD
   ```
3. Fill in the new release entry in `CHANGELOG.md`.
4. Commit and push.
5. Optional: create a tag such as `v1.0.X`.
6. Build the deployable zip:
   ```sh
   sh scripts/build-theme-package.sh
   ```
   Or, if tagging:
   ```sh
   sh scripts/build-theme-package.sh v1.0.X
   ```
7. Open `dist/` in the source repo.
8. Upload the new zip to LocalWP, test, or production.
9. Replace the existing `icts-europe` theme.
10. Clear cache if needed.
11. Check the affected pages and features.

## ACF JSON rule

- If ACF field groups are edited in WordPress admin, WordPress writes JSON into the active theme folder.
- If the active theme is not symlinked to the source repo, copy the updated `acf-json/` files back into `/Users/philipevans/Code/icts-europe` before the next release.
- If no ACF field groups changed, nothing special is needed.

## Important rules

- Source of truth for code: `/Users/philipevans/Code/icts-europe`
- Installed/test copy only: `/Users/philipevans/Local Sites/iesaero/app/public/wp-content/themes/icts-europe`
- Do not make design, template, or theme edits directly in the LocalWP theme folder.
- Do not upload a GitHub “Download ZIP”.
- Always upload the zip built from `dist/`.
- Do not overwrite the database during a theme deployment.

## Simple memory version

- Edit in `Code/icts-europe`
- Test locally
- Sync `acf-json` if needed
- Run release script
- Fill changelog
- Commit and push
- Build zip from `dist/`
- Upload zip
- Test again

## Starter prompt for future chats

```text
Project: ICTS Europe WordPress theme
Source repo: /Users/philipevans/Code/icts-europe
LocalWP installed theme: /Users/philipevans/Local Sites/iesaero/app/public/wp-content/themes/icts-europe

Instructions:
- Follow AGENTS.md in the source repo.
- Work only in the source repo unless I explicitly ask otherwise.
- Treat the LocalWP theme path as the installed/test copy, not the source of truth.
- Only inspect files directly related to this task; don’t scan widely unless blocked.
- Reuse existing patterns, classes, and styles where possible.
- Keep patches small and scoped; do not refactor unrelated code.
- Update docs only if behavior or workflow conventions changed.
- Do not modify unrelated dirty files.
- Run quick validation on touched files where relevant.
- If ACF field groups were changed in WordPress admin, sync `acf-json` changes back into the source repo before release.

Task:
- [One clear outcome]
- [Specific requirements]
- [Any design/source references to match]

Done criteria:
- [What must be true when finished]

Return:
- Files changed
- Concise per-file summary
- Assumptions or follow-ups
```
