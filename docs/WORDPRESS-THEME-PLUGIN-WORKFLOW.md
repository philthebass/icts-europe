# WordPress Theme and Plugin Workflow

## Core rule

- Keep the source repo outside the Local WordPress install.
- Use LocalWP as the running environment, not the source of truth.
- Keep GitHub or your local repo as the authoritative source for code.

## Recommended folder structure

```text
~/Code/
  project-theme/
  project-plugin/

~/Local Sites/
  site-name/
    app/public/wp-content/themes/project-theme
    app/public/wp-content/plugins/project-plugin
```

## Best setup

- Store the real Git repo in `~/Code/...`
- Symlink the theme or plugin into the LocalWP site
- Open and edit the repo from `~/Code/...`

This keeps source control clean while still allowing WordPress, ACF, and other runtime dependencies to work normally.

## Theme symlink example

Example paths:

- Source repo: `~/Code/icts-europe`
- LocalWP theme path: `~/Local Sites/iesaero/app/public/wp-content/themes/icts-europe`

If the LocalWP theme folder already exists:

```sh
cd "~/Local Sites/iesaero/app/public/wp-content/themes"
mv icts-europe icts-europe-backup
ln -s ~/Code/icts-europe icts-europe
```

If the LocalWP theme folder does not exist yet:

```sh
cd "~/Local Sites/iesaero/app/public/wp-content/themes"
ln -s ~/Code/icts-europe icts-europe
```

## Plugin symlink example

Example paths:

- Source repo: `~/Code/my-plugin`
- LocalWP plugin path: `~/Local Sites/mysite/app/public/wp-content/plugins/my-plugin`

If the LocalWP plugin folder already exists:

```sh
cd "~/Local Sites/mysite/app/public/wp-content/plugins"
mv my-plugin my-plugin-backup
ln -s ~/Code/my-plugin my-plugin
```

If the LocalWP plugin folder does not exist yet:

```sh
cd "~/Local Sites/mysite/app/public/wp-content/plugins"
ln -s ~/Code/my-plugin my-plugin
```

## How to verify a symlink

Run:

```sh
ls -l "~/Local Sites/iesaero/app/public/wp-content/themes"
```

You should see output similar to:

```text
icts-europe -> /Users/your-name/Code/icts-europe
```

## ACF JSON rule

- ACF local JSON writes into the active theme or plugin folder.
- If the active theme or plugin is symlinked to the repo, the JSON writes into the real repo automatically.
- If you are using a copied install instead of a symlink, copy the updated `acf-json/` files back into the repo before committing or releasing.

## Recommended release workflow

1. Open the source repo in `~/Code/...`
2. Make and test the change locally
3. If relevant, save Site Editor changes back into theme files
4. If relevant, sync `acf-json` back into the repo
5. Commit and push from the repo
6. Build the release zip from the repo
7. Upload the zip to LocalWP, staging, or production
8. Replace the existing theme or plugin
9. Clear cache if needed
10. Smoke-test the affected pages or features

## Important rules

- Never use the LocalWP install folder as the only source repo.
- Always treat the repo as the source of truth.
- Build release zips from the repo, not from a random installed copy.
- Do not upload a GitHub “Download ZIP” for deployments.
- Do not overwrite the database during a normal theme or plugin deployment.

## Simple memory version

- Edit in `~/Code/...`
- Test in LocalWP
- Sync `acf-json` if needed
- Commit and push
- Build zip
- Upload zip
- Test again
