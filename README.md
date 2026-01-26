# ICTS Europe Block Theme

Custom WordPress block theme for the ICTS Europe / IES Aero website rebuild.

This theme is a bespoke Full Site Editing (FSE) theme developed specifically for this project and is **not intended for general distribution**.

---

## Overview

- Custom WordPress block theme
- Built for WordPress Full Site Editing (FSE)
- Designed and developed for the ICTS Europe project
- Optimised for performance, accessibility, and maintainability

---

## Technical Details

- **WordPress:** 6.0+
- **PHP:** 7.2+
- **Theme type:** Block theme (FSE)
- **Editor:** WordPress Site Editor
- **Version control:** Git / GitHub

---

## Project Structure

```
icts-europe/
├── assets/
│   ├── js/
│   ├── styles/
│   └── vendor/
├── inc/
│   └── blocks.php
├── parts/
├── patterns/
├── styles/
├── template-parts/
│   └── blocks/
│       └── client-logos-slider.php
├── templates/
├── functions.php
├── theme.json
├── style.css
└── README.md
```

---

## Development Notes

- Developed locally using **LocalWP**
- Version-controlled via **GitHub**
- No build step required
- Changes should be committed frequently with clear commit messages

---

## Custom Blocks

### Client Logos Slider

**Handle:** `client-logos-slider`  
**Location:** `template-parts/blocks/client-logos-slider.php`  
**Type:** ACF block using Flickity (continuous marquee-style carousel)

---

### Purpose

Displays a full-width, continuously scrolling strip of client logos.

Logos are managed centrally via an ACF Options Page so the same logo carousel can be reused consistently across pages and templates without duplication.

The slider behaves as a **continuous ticker** (no snapping), pauses on hover, and respects reduced motion preferences.

Client Logos Slider – Behaviour Notes

The Client Logos Slider uses a single continuous Flickity marquee implementation for all scenarios.

Key behaviour
	•	Logos always scroll continuously on the front end, regardless of how many logos are available.
	•	When there are only a small number of logos, the block duplicates the logo set automatically to ensure:
	•	Even spacing
	•	No visual gaps
	•	A smooth, uninterrupted loop
	•	This avoids the need for a separate “static” slider mode and keeps the implementation lightweight and predictable.

Editor preview behaviour
	•	In the WordPress block editor, the slider renders as a static, centred preview:
	•	No animation
	•	Single horizontal row
	•	Limited number of logos shown for clarity
	•	This is intentional and improves editor UX while avoiding unnecessary JS execution in the editor.
	•	The front-end behaviour is unaffected.

Logo sizing
	•	Logos are visually normalised using a fixed-height flex container and constrained image dimensions.
	•	This ensures a consistent appearance across logos with very different aspect ratios (e.g. wide wordmarks vs tall symbols), matching the behaviour of the legacy site.

Accessibility & performance
	•	The slider respects prefers-reduced-motion.
	•	Animation is driven via requestAnimationFrame for smooth, GPU-friendly motion.
	•	No duplicate slider logic or conditional layout branches are used.

---

### Dependencies

- **Advanced Custom Fields Pro**  
  https://www.advancedcustomfields.com/

- **ACF Options Page**  
  Menu slug: `client-logos`

- **Optional:** Polylang  
  https://polylang.pro/

- **Flickity** v2.x  
  - CSS: `assets/vendor/flickity/flickity.min.css`
  - JS: `assets/vendor/flickity/flickity.pkgd.min.js`

- **Block JavaScript:**  
  `assets/js/client-logos-flickity.js`

---

## Licence

This theme inherits the GPL licence from its upstream dependencies.
