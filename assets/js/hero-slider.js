(function () {
    /**
     * Initialise hero sliders within an optional context element.
     * Ensures each slider is only initialised once.
     */
    function initHeroSliders(context) {
        const root = context || document;

        const sliders = root.querySelectorAll(
            '.js-icts-hero-slider:not(.is-icts-hero-slider-init)'
        );

        sliders.forEach(function (sliderEl) {
            sliderEl.classList.add('is-icts-hero-slider-init');

            const isEditor = !!(document.body && document.body.classList.contains('block-editor-page'));
            const isRtl = !!(document.documentElement && document.documentElement.dir === 'rtl');

            // eslint-disable-next-line no-undef
            const flkty = new Flickity(sliderEl, {
                cellSelector: '.icts-hero-slider__slide',
                wrapAround: true,
                autoPlay: isEditor ? false : 7000,
                pauseAutoPlayOnHover: isEditor ? false : true,
                prevNextButtons: isEditor ? true : false,
                pageDots: false,
                rightToLeft: isRtl,
                // In the editor, keep Flickity non-draggable so clicks focus
                // RichText fields instead of moving the carousel.
                draggable: isEditor ? false : true,
                setGallerySize: false
            });

            const container = sliderEl.closest('.icts-hero-slider');
            // Preserve editor-selected slide across re-renders
            let savedIndex = 0;
            if (container && container.dataset && container.dataset.ictsSelectedIndex) {
                const parsed = parseInt(container.dataset.ictsSelectedIndex, 10);
                if (!Number.isNaN(parsed)) savedIndex = parsed;
            }
            let indicatorsWrap = container?.querySelector(
                '.js-icts-hero-slider-indicators'
            );
            // If indicators wrapper is missing or empty, generate buttons
            function generateIndicators() {
                const cells = sliderEl.querySelectorAll('.icts-hero-slider__slide');
                cells.forEach(function (_c, idx) {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'icts-hero-slider__indicator' + (idx === 0 ? ' is-active' : '');
                    btn.setAttribute('role', 'tab');
                    btn.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
                    btn.setAttribute('aria-label', 'Go to slide ' + (idx + 1));
                    btn.setAttribute('data-slide-index', String(idx));
                    const bar = document.createElement('span');
                    bar.className = 'icts-hero-slider__indicator-bar';
                    btn.appendChild(bar);
                    indicatorsWrap.appendChild(btn);
                });
            }

            if (!indicatorsWrap) {
                indicatorsWrap = document.createElement('div');
                indicatorsWrap.className = 'icts-hero-slider__indicators js-icts-hero-slider-indicators';
                indicatorsWrap.setAttribute('role', 'tablist');
                indicatorsWrap.setAttribute('aria-label', 'Hero slider pagination');
                container.appendChild(indicatorsWrap);
                generateIndicators();
            }

            // If wrapper exists but has no buttons (e.g., native block saved empty container), build them now
            if (!indicatorsWrap.querySelector('.icts-hero-slider__indicator')) {
                generateIndicators();
            }

            const indicatorButtons = indicatorsWrap.querySelectorAll(
                '.icts-hero-slider__indicator'
            );

            // Click → jump to slide
            indicatorButtons.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    const index = parseInt(
                        btn.getAttribute('data-slide-index'),
                        10
                    );
                    if (!Number.isNaN(index)) {
                        flkty.select(index);
                    }
                });
            });

            function updateActiveIndicator(index) {
                indicatorButtons.forEach(function (btn, i) {
                    if (i === index) {
                        btn.classList.add('is-active');
                        btn.setAttribute('aria-selected', 'true');
                    } else {
                        btn.classList.remove('is-active');
                        btn.setAttribute('aria-selected', 'false');
                    }
                });
            }

            // Restore previously selected slide (especially in the editor)
            if (savedIndex && savedIndex !== flkty.selectedIndex) {
                flkty.select(savedIndex, false, true);
            }
            updateActiveIndicator(flkty.selectedIndex);

            flkty.on('change', function (index) {
                updateActiveIndicator(index);
                if (container && container.dataset) {
                    container.dataset.ictsSelectedIndex = String(index);
                }
            });
        });
    }

    // Front end: run on DOM ready (never in the block editor)
    document.addEventListener('DOMContentLoaded', function () {
        if (document.body && document.body.classList.contains('block-editor-page')) {
            return; // do not initialise in editor
        }
        initHeroSliders(document);
    });

    // Expose init for editor reuse
    if (typeof window !== 'undefined') {
        window.ICTS = window.ICTS || {};
        window.ICTS.initHeroSliders = initHeroSliders;
    }
})();
