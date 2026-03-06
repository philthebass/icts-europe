(function () {
    /**
     * Initialise all testimonials sliders inside a given context element.
     * @param {HTMLElement|Document} root
     */
    function initTestimonialsSliders(root) {
        var context = root || document;

        if (typeof Flickity === 'undefined') {
            return;
        }

        var sliders = context.querySelectorAll('.js-testimonials-slider');

        if (!sliders.length) {
            return;
        }

        sliders.forEach(function (slider) {
            // Avoid double-initialising the same element.
            if (slider.dataset.flickityInit === '1') {
                return;
            }
            slider.dataset.flickityInit = '1';

            var isEditor = !!(
                document.body &&
                document.body.classList.contains('block-editor-page')
            );
            var prefersReducedMotion = !!(
                window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches
            );
            var autoPlayMs = !isEditor && !prefersReducedMotion ? 5000 : 0;

            // eslint-disable-next-line no-undef
            var flkty = new Flickity(slider, {
                cellAlign: 'center',
                contain: false,
                wrapAround: true,
                pageDots: true,
                prevNextButtons: false,
                adaptiveHeight: true,
                autoPlay: false,
                pauseAutoPlayOnHover: !!autoPlayMs
            });

            if (!autoPlayMs) {
                return;
            }

            flkty.options.autoPlay = autoPlayMs;
            flkty.stopPlayer();

            var isInViewport = false;
            var isPlaying = false;
            var pageIsFullyLoaded = document.readyState === 'complete';

            function startAutoplayCycle() {
                if (isPlaying) {
                    return;
                }

                flkty.stopPlayer();
                flkty.playPlayer();
                isPlaying = true;
            }

            function stopAutoplayCycle() {
                if (!isPlaying) {
                    return;
                }

                flkty.stopPlayer();
                isPlaying = false;
            }

            function maybeStartAutoplay() {
                if (isInViewport && pageIsFullyLoaded) {
                    setTimeout(startAutoplayCycle, 40);
                }
            }

            window.addEventListener(
                'load',
                function () {
                    pageIsFullyLoaded = true;
                    maybeStartAutoplay();
                },
                { once: true }
            );

            if ('IntersectionObserver' in window) {
                var observer = new IntersectionObserver(
                    function (entries) {
                        entries.forEach(function (entry) {
                            if (!entry.isIntersecting) {
                                isInViewport = false;
                                stopAutoplayCycle();
                                return;
                            }

                            isInViewport = true;
                            maybeStartAutoplay();
                        });
                    },
                    { threshold: 0.35 }
                );

                observer.observe(slider);
            } else {
                isInViewport = true;
                maybeStartAutoplay();
            }
        });
    }

    // Front end.
    document.addEventListener('DOMContentLoaded', function () {
        initTestimonialsSliders(document);
    });

    // Block editor (ACF preview).
    if (window.acf && typeof window.acf.addAction === 'function') {
        window.acf.addAction(
            'render_block_preview/type=testimonials-slider',
            function ($block) {
                if ($block && $block[0]) {
                    initTestimonialsSliders($block[0]);
                }
            }
        );
    }
})();
