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

            // eslint-disable-next-line no-undef
            const flkty = new Flickity(sliderEl, {
                cellSelector: '.icts-hero-slider__slide',
                wrapAround: true,
                autoPlay: 7000,
                pauseAutoPlayOnHover: true,
                prevNextButtons: false,
                pageDots: false,
                draggable: true,
                setGallerySize: false
            });

            const container = sliderEl.closest('.icts-hero-slider');
            const indicatorsWrap = container?.querySelector(
                '.js-icts-hero-slider-indicators'
            );
            if (!indicatorsWrap) return;

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

            updateActiveIndicator(flkty.selectedIndex);

            flkty.on('change', function (index) {
                updateActiveIndicator(index);
            });
        });
    }

    // Front end: run on DOM ready
    document.addEventListener('DOMContentLoaded', function () {
        initHeroSliders(document);
    });

    // Block editor: hook into ACF block preview rendering
    if (window.acf && typeof window.acf.addAction === 'function') {
        window.acf.addAction(
            'render_block_preview/type=hero-slider',
            function ($block) {
                // $block is a jQuery object – get the raw element
                initHeroSliders($block[0]);
            }
        );
    }
})();