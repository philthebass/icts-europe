(function () {
    /**
     * Initialise solutions sliders within an optional context.
     *
     * @param {HTMLElement|Document} context
     */
    function initSolutionsSliders(context) {
        var root = context || document;
        var sliders = root.querySelectorAll(
            '.js-icts-solutions-slider:not(.is-icts-solutions-slider-init)'
        );

        if (!sliders.length || typeof Flickity === 'undefined') {
            return;
        }

        sliders.forEach(function (sliderEl) {
            sliderEl.classList.add('is-icts-solutions-slider-init');

            var isRtl = !!(
                document.documentElement &&
                document.documentElement.getAttribute('dir') === 'rtl'
            );
            var isStackedLayout = !!(
                window.matchMedia &&
                window.matchMedia('(max-width: 900px)').matches
            );
            var prefersReducedMotion = !!(
                window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches
            );

            var container = sliderEl.closest('.icts-solutions-slider');
            var autoPlayMs = 7000;

            if (container && container.dataset && container.dataset.autoplay) {
                var parsedDuration = parseInt(container.dataset.autoplay, 10);
                if (!Number.isNaN(parsedDuration) && parsedDuration > 0) {
                    autoPlayMs = parsedDuration;
                }
            }

            if (prefersReducedMotion) {
                autoPlayMs = 0;
            }

            // eslint-disable-next-line no-undef
            var flkty = new Flickity(sliderEl, {
                cellSelector: '.icts-solutions-slider__slide',
                cellAlign: isStackedLayout ? 'left' : 'center',
                contain: isStackedLayout,
                wrapAround: !isStackedLayout,
                autoPlay: false,
                pauseAutoPlayOnHover: !!autoPlayMs,
                prevNextButtons: true,
                pageDots: false,
                rightToLeft: isRtl,
                adaptiveHeight: true
            });

            if (container) {
                if (autoPlayMs) {
                    container.style.setProperty(
                        '--icts-solutions-autoplay',
                        String(autoPlayMs) + 'ms'
                    );
                }
                container.classList.toggle('is-solutions-no-autoplay', !autoPlayMs);
                container.classList.remove('is-solutions-playing');
            }

            var indicatorsWrap = container
                ? container.querySelector('.js-icts-solutions-slider-indicators')
                : null;

            function generateIndicators() {
                var cells = sliderEl.querySelectorAll('.icts-solutions-slider__slide');
                cells.forEach(function (_cell, index) {
                    var button = document.createElement('button');
                    button.type = 'button';
                    button.className =
                        'icts-solutions-slider__indicator' +
                        (index === 0 ? ' is-active' : '');
                    button.setAttribute('role', 'tab');
                    button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
                    button.setAttribute('aria-label', 'Go to slide ' + (index + 1));
                    button.setAttribute('data-slide-index', String(index));

                    var bar = document.createElement('span');
                    bar.className = 'icts-solutions-slider__indicator-bar';
                    button.appendChild(bar);
                    indicatorsWrap.appendChild(button);
                });
            }

            if (!indicatorsWrap && container) {
                indicatorsWrap = document.createElement('div');
                indicatorsWrap.className =
                    'icts-solutions-slider__indicators js-icts-solutions-slider-indicators';
                indicatorsWrap.setAttribute('role', 'tablist');
                indicatorsWrap.setAttribute('aria-label', 'Solutions slider pagination');
                sliderEl.appendChild(indicatorsWrap);
                generateIndicators();
            }

            if (indicatorsWrap && indicatorsWrap.parentNode !== sliderEl) {
                sliderEl.appendChild(indicatorsWrap);
            }

            if (
                indicatorsWrap &&
                !indicatorsWrap.querySelector('.icts-solutions-slider__indicator')
            ) {
                generateIndicators();
            }

            if (!indicatorsWrap) {
                return;
            }

            var indicatorButtons = indicatorsWrap.querySelectorAll(
                '.icts-solutions-slider__indicator'
            );

            indicatorButtons.forEach(function (button) {
                button.addEventListener('click', function () {
                    var slideIndex = parseInt(button.getAttribute('data-slide-index'), 10);
                    if (!Number.isNaN(slideIndex)) {
                        flkty.select(slideIndex);
                    }
                });
            });

            function updateActiveIndicator(index) {
                indicatorButtons.forEach(function (button, buttonIndex) {
                    if (buttonIndex === index) {
                        button.classList.add('is-active');
                        button.setAttribute('aria-selected', 'true');
                    } else {
                        button.classList.remove('is-active');
                        button.setAttribute('aria-selected', 'false');
                    }
                });
            }

            updateActiveIndicator(flkty.selectedIndex);

            flkty.on('change', function (index) {
                updateActiveIndicator(index);
            });

            if (autoPlayMs) {
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

                    if (container) {
                        container.classList.add('is-solutions-playing');
                    }
                }

                function stopAutoplayCycle() {
                    if (!isPlaying) {
                        return;
                    }

                    flkty.stopPlayer();
                    isPlaying = false;

                    if (container) {
                        container.classList.remove('is-solutions-playing');
                    }
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

                    observer.observe(sliderEl);
                } else {
                    isInViewport = true;
                    maybeStartAutoplay();
                }
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        if (document.body && document.body.classList.contains('block-editor-page')) {
            return;
        }
        initSolutionsSliders(document);
    });

    if (typeof window !== 'undefined') {
        window.ICTS = window.ICTS || {};
        window.ICTS.initSolutionsSliders = initSolutionsSliders;
    }
})();
