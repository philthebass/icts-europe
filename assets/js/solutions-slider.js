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

            function applyArrowShape(flickityInstance) {
                if (!flickityInstance || !flickityInstance.prevButton || !flickityInstance.nextButton) {
                    return;
                }

                [flickityInstance.prevButton, flickityInstance.nextButton].forEach(function (buttonObj) {
                    var element = buttonObj && buttonObj.element ? buttonObj.element : null;
                    if (!element) {
                        return;
                    }

                    var svg = element.querySelector('.flickity-button-icon');
                    if (!svg) {
                        return;
                    }

                    svg.setAttribute('viewBox', '0 0 68.899 66.337');
                    svg.innerHTML =
                        '<path class="icts-solutions-arrow-fill-shape" d="M22.168 7.521a5 5 0 0 1 8.665 0L48.682 38.5A5 5 0 0 1 44.349 46H8.651a5 5 0 0 1-4.332-7.5Z"></path>' +
                        '<path class="icts-solutions-arrow-stroke-shape" d="M 26.50002861022949 6.016448974609375 C 25.0523681640625 6.016448974609375 23.75667953491211 6.765338897705078 23.03403854370117 8.019729614257812 L 5.184787750244141 39.00331878662109 C 4.463329315185547 40.25564956665039 4.464397430419922 41.75035858154297 5.187629699707031 43.00167083740234 C 5.910858154296875 44.25297927856445 7.205497741699219 45.00003051757812 8.650779724121094 45.00003051757812 L 44.34927749633789 45.00003051757812 C 45.79455947875977 45.00003051757812 47.08919906616211 44.25297927856445 47.81242752075195 43.00167083740234 C 48.53565979003906 41.75035858154297 48.53672790527344 40.25564956665039 47.81526947021484 39.00331878662109 L 29.96601867675781 8.019729614257812 C 29.24337768554688 6.765338897705078 27.94768905639648 6.016448974609375 26.50002861022949 6.016448974609375 M 26.50002861022949 5.016448974609375 C 28.1854133605957 5.016448974609375 29.87079811096191 5.851150512695312 30.83251953125 7.520549774169922 L 48.68177032470703 38.5041389465332 C 50.60205841064453 41.83747100830078 48.1961669921875 46.00003051757812 44.34927749633789 46.00003051757812 L 8.650779724121094 46.00003051757812 C 4.803890228271484 46.00003051757812 2.397998809814453 41.83747100830078 4.318286895751953 38.5041389465332 L 22.16753768920898 7.520549774169922 C 23.12925910949707 5.851150512695312 24.81464385986328 5.016448974609375 26.50002861022949 5.016448974609375 Z"></path>';

                    svg.style.transformOrigin = '50% 50%';
                    if (element.classList.contains('previous')) {
                        svg.style.transform = 'rotate(30deg)';
                    } else {
                        svg.style.transform = 'rotate(-30deg)';
                    }
                });
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
            applyArrowShape(flkty);
            var readyMarked = false;
            function markReady() {
                if (readyMarked) {
                    return;
                }
                readyMarked = true;
                sliderEl.classList.add('is-icts-solutions-slider-ready');
            }

            flkty.on('ready', function () {
                flkty.resize();
                markReady();
            });

            flkty.once('settle', function () {
                markReady();
            });

            window.requestAnimationFrame(function () {
                window.requestAnimationFrame(function () {
                    flkty.resize();
                    markReady();
                });
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
