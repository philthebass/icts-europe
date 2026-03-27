# Project Context — ICTS Europe Theme

## Project Overview
This repository contains the custom WordPress Full Site Editing (FSE) block theme used to rebuild **ies.aero**, replacing the existing WordPress site.

The theme is based on **Ollie** and extended to support:
- A multilingual site (9 languages)
- Custom blocks and patterns
- High performance and maintainability
- Editorial workflows suitable for non-technical users

This repo focuses on **theme development only**. Content, translations, and environment configuration are managed externally.
Purpose
- Custom WordPress block theme for ICTS Europe / IES Aero.
- Built for Full Site Editing; minimal PHP templates; ACF blocks for select components.

Audience
- Marketing/content editors managing pages, team, customers, and testimonials.

## Environments

- Local development on macOS via LocalWP.
- GitHub repository as the source of truth (default branch: `main`).
- Final sign-off/testing will use a staging subdomain: `dev.ies.aero` (to be provisioned).
- The legacy site and its staging remain separate during the rebuild.

Tech targets:
- WordPress: 6.9.x
- PHP: 7.3+


Brand & Tokens (current)
- Colors: brand-primary, brand-secondary, brand-tertiary, base, main, secondary, tertiary, border-light.
- Typography: Nunito Sans; sizes x-small, small, base, large, x-large, and h-1..h-6 (fluid).

Content Model
- CPTs: customers, testimonial, team-member, faq.
- Taxonomies: customer-type, product (shared filters across customers + FAQs).
- FAQ rendering: `acf/faq-accordion` block with optional block-level taxonomy scoping and per-block FAQPage JSON-LD output.
- Reusable metrics: `acf/counter` block for editable numeric counters (up/down, affixes, labels).

## Languages

- Default language: UK English (en_GB)
- Active Polylang languages per current site:
  - en_GB, es_ES, fr_FR, nl_NL, pt_BR, pt_PT, ar, zh_CN (Simplified), zh_HK (Traditional)
- Translation workflow: Polylang Pro + DeepL; editors review outputs.

Team archive slug:
- Slug key: `team_member_archive_slug` with default `management-team`.
- Translate slugs in Polylang → Strings per language (or keep English everywhere).



Plugins
- ACF Pro (+ Options/Local JSON)
- Polylang (optional)
- WooCommerce (optional styles)

Required plugin settings
- Polylang → Languages → Settings → Synchronization → `Custom fields`: **enabled**.
- Reason: required for reliable metadata syncing in translated FSE entities (notably navigation/template-related workflows).

Accessibility & Motion
- Sliders pause on hover; respect prefers-reduced-motion. No visible Pause control required for now.
- Indicators keyboard accessible; ARIA labels present.
- Reusable reveal utility available: add `.icts-reveal-grid` to a container to animate children on viewport entry (optional `data-icts-reveal-item-selector` override; `data-icts-reveal-skip` per-item opt-out).
- Navigation uses click-driven mega panels (desktop) and drawer panels (mobile), with reverse close animations.
- Desktop supports second-level and fixed-position third-level flyouts; mobile supports parent-aware Back navigation.
- Class-based menu icons (`nav-icon-*`) are shared across desktop and mobile submenu items.

Editor usage (reveal utility)
- In Site Editor, select the parent Grid/Group block and add `icts-reveal-grid` under Advanced → Additional CSS class(es).
- Default behavior animates direct children of that container.
- Optional for nested structures: add an HTML attribute on the parent block: `data-icts-reveal-item-selector=".wp-block-column"` (replace selector as needed).
- Optional per-item opt-out: add HTML attribute `data-icts-reveal-skip` on any child that should not animate.
- Copy/paste quick examples:
  - Class: `icts-reveal-grid`
  - Attribute (parent): `data-icts-reveal-item-selector=".wp-block-group > .wp-block-column"`
  - Attribute (child): `data-icts-reveal-skip`

Editor usage (feature card grid)
- For reusable feature card sections built with the core Grid block, add a variant class to the parent Grid block under Advanced → Additional CSS class(es).
- Use `feature-card-grid--industries` for the wider industry card layout: `3` columns from `960px` to `1759px`, `2` columns from `617px` to `959px`, and `1` column at `616px` and below.
- Use `feature-card-grid--usp` for 4-up USP/benefit card layouts: `4` columns from `960px` to `1759px`, `2` columns from `617px` to `959px`, and `1` column at `616px` and below.
- Keep the Grid block for editor authoring, but treat these variant classes as required when feature-card sections need predictable wrapping behavior.
- Expected inner classes:
  - Shared card wrapper: `feature-card`
  - Shared image figure: `feature-card__image`
  - Shared content wrapper: `feature-card__content`
  - Heading text: `feature-card__title`
  - Body copy: `feature-card__body`
  - USP icon block only: `feature-card__icon`
- Current USP SVG icon set is normalized to shared `180x80` artboards in `assets/images/feature-icon-*-normalized.svg`; re-upload those files to WordPress media if the icon sources are replaced.

Performance
- No bundler required. Vendor JS: Flickity v2.x.
- Image optimisation planned with ShortPixel Image Optimizer (WebP) when staging is available.

Deployment
- Commit to GitHub; Create Block Theme used to sync editor styles to theme.json.

Open Questions
- Final brand palette/contrast targets.
- Autoplay policy for hero/testimonials (current defaults OK).

Design decisions should favour:
- Reusability
- Accessibility (WCAG 2.1 AA)
- Editor clarity over visual novelty

---

## Goals

Primary goals:
- Replace legacy WordPress site which uses Oxygen Builder Classic with a modern FSE architecture
- Improve performance, maintainability, and editorial experience
- Support scalable multilingual content

Non-goals:
- No custom page builder
- No heavy JavaScript frameworks
- No bespoke translation system outside Polylang

---

## Stakeholders

- Client: IES (Internal team)
- Technical lead / developer: Philip Evans
- Content editors: Non-technical, multilingual users
- Future developers: Expected to maintain and extend this theme

---

## Constraints & Assumptions

- WordPress core updates must not break the theme
- Polylang Pro is a fixed dependency
- Content migrations may occur from production into local/staging
- Local and production ACF schemas may be temporarily out of sync
