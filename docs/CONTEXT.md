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
- Typography: Nunito Sans; sizes small, base, x-small, large, h-1..h-6 (fluid).

Content Model
- CPTs: customers, testimonial, team-member.
- Taxonomies: customer-type, product (for filtering client logos).

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

Accessibility & Motion
- Sliders pause on hover; respect prefers-reduced-motion. No visible Pause control required for now.
- Indicators keyboard accessible; ARIA labels present.

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
