# Release Workflow

## Source of truth

- Theme code lives in this repository and is released from GitHub.
- Content, translations, and QA feedback live on the test server.
- Do not treat the test server as the place where theme structure is edited.

## WordPress block theme rule

- Templates, template parts, patterns, `theme.json`, CSS, JS, and PHP should be changed locally first.
- If you use the Site Editor locally for design work, save those changes back into theme files with Create Block Theme before committing.
- Avoid making theme or Site Editor design changes directly on the test server unless they are immediately recreated locally and committed.

## Release steps

1. Pull the latest `main` locally.
2. Build and test the theme change locally against a recent copy of test content where needed.
3. If relevant, use Create Block Theme to save editor-driven changes into theme files.
4. Run quick validation on changed files.
5. Update the version number in `style.css`.
6. Add a release entry to `CHANGELOG.md`.
7. Commit and push to GitHub.
8. Tag the release, for example `v1.0.2`.
9. Deploy that exact tagged theme version to the test server.
10. Smoke-test the affected pages, templates, and editor views on the test server.

## Deployment guidance

- Preferred: deploy the theme from the tagged Git commit or a zip built from that tag.
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
