# AGENTS.md — ICTS Europe Theme

Scope: This file governs how Codex works in this repository (the ICTS Europe WordPress block theme).

Goals
- Keep the theme fast, accessible, and maintainable.
- Prefer WordPress-native features (theme.json, FSE) and minimal custom code.
- Document decisions and keep a visible TODO queue for small iterations.

How We Work
- One chat per repo; use the plan tool for multi-step tasks.
- Capture background in `docs/CONTEXT.md` and log rationale in `docs/DECISIONS.md`.
- Keep patches small and focused. Update docs when behavior or conventions change.
 - Editor style changes: use Create Block Theme → “Save Changes To Theme”, then commit via VS Code.
 - Branching/deploy: default branch `main`; staging target will be `dev.ies.aero` when provisioned; legacy site remains separate.

Coding Conventions
- PHP namespace: `ICTS_Europe`.
- Enqueue handles: use `icts-europe` for the main stylesheet; register/reuse shared vendor assets (e.g., Flickity) with stable handles.
- Translations: load with `load_theme_textdomain( 'icts-europe', get_template_directory() . '/languages' )`.
- Escaping: `esc_url`, `esc_html`, `wp_kses_post` as appropriate. Avoid echoing unescaped content.
- Block assets: enqueue per-block within ACF `enqueue_assets` callbacks.
- Theme JSON: use hyphenated heading slugs `h-1 … h-6`; keep preset slugs consistent with CSS classes.
- Accessibility: respect `prefers-reduced-motion`; ensure focus states and ARIA labelling (e.g., sliders’ indicators) are present.
 - WooCommerce: not in scope; only enqueue `assets/styles/woocommerce.css` if WooCommerce is active (already guarded).

Brand Tokens (current)
- Font families: `nunito-sans` (primary), `monospace`.
- Font sizes: include `small`, `base`, `x-small`, `large`, and `h-1…h-6`.
- Colors: `brand-primary`, `brand-secondary`, `brand-tertiary`, plus utility tokens: `base`, `main`, `secondary`, `tertiary`, `border-light`.

Reviews & Testing
- Sanity-check front end and Site Editor after theme.json changes (hard reload).
- Verify global styles load (devtools: `--wp--preset--*` variables present).
- Keep admin UX polish where we modify CPT columns.

Skills (available in this session)
- `skill-installer`: install Codex skills from curated list or repos.
- `skill-creator`: create/update skills for repeatable workflows.
