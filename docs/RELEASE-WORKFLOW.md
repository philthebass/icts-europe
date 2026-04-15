# Release Workflow

## Source of truth

- Theme code lives in this repository and is released from GitHub.
- Working source repo path: `/Users/philipevans/Code/icts-europe`.
- LocalWP installed theme path: `/Users/philipevans/Local Sites/iesaero/app/public/wp-content/themes/icts-europe`.
- Content, translations, and QA feedback live on the test server.
- Do not treat the test server as the place where theme structure is edited.
- Do not edit theme files directly in the LocalWP theme folder; treat it as the installed test copy only.

## WordPress block theme rule

- Templates, template parts, patterns, `theme.json`, CSS, JS, and PHP should be changed locally first.
- If you use the Site Editor locally for design work, save those changes back into theme files with Create Block Theme before committing.
- Avoid making theme or Site Editor design changes directly on the test server unless they are immediately recreated locally and committed.
- If you change ACF field groups in WordPress admin, copy the resulting `acf-json/` changes back into this repository before committing or releasing.

## Release steps

1. Open `/Users/philipevans/Code/icts-europe` and pull the latest `main`.
2. Build and test the theme change locally against a recent copy of test content where needed.
3. If relevant, use Create Block Theme to save editor-driven changes into theme files.
4. If relevant, sync any `acf-json/` changes made through WordPress admin back into this repo.
5. Run quick validation on changed files.
6. Update the version number in `style.css`.
7. Add a release entry to `CHANGELOG.md`.
8. Commit and push to GitHub.
9. Tag the release, for example `v1.0.2`.
10. Build the deployable zip from this repository.
11. Install that zip into LocalWP or the test server by replacing the existing `icts-europe` theme.
12. Smoke-test the affected pages, templates, and editor views.

## Local helper commands

- Easiest option for the next release:
  - `sh scripts/release-theme.sh 1.0.2 2026-04-01`
- This updates `style.css` and inserts the next release template into `CHANGELOG.md`.
- After filling in the changelog and committing, build the deployable zip:
  - `sh scripts/build-theme-package.sh`
  - `sh scripts/build-theme-package.sh v1.0.2`
- If you want the lower-level command, you can still run:
  - `php scripts/prepare-release.php 1.0.2 2026-04-01`
- Output package location:
  - `dist/icts-europe-v1.0.2.zip`

The release helper updates `style.css` and inserts a new changelog template near the top of `CHANGELOG.md`. Fill in the blank bullets before committing.
Build the zip after committing, and preferably after tagging, so the package matches the release exactly.

## Deployment guidance

- Preferred: deploy the theme from the tagged Git commit or a zip built from that tag.
- The generated zip excludes repo-only files such as `docs/`, `scripts/`, `AGENTS.md`, and other local development metadata via `.gitattributes`.
- Replace theme files only. Do not overwrite the database as part of a normal theme deploy.
- Clear caches after deployment if the platform or plugins cache assets/templates.

## Content sync guidance

- Once the test server becomes the active editorial environment, do not push your local database over it.
- Pull content from test to local when you need fresher editorial data for development.
- Take a backup before any database sync.

## Versioning

- Patch: safe fixes and small styling/behavior tweaks.
- Minor: new templates, blocks, patterns, or significant UI changes.
- Major: breaking structural changes or release resets that need explicit coordination.

## Suggested commit/release hygiene

- Keep feature branches short-lived for larger work.
- Release from `main`.
- Match the deployed theme on the test server to a Git tag.
- Record anything editors or testers need to know in the changelog entry.
