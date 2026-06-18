(function () {
    function isIOSWebKit() {
        var ua = window.navigator && window.navigator.userAgent ? window.navigator.userAgent : '';
        var platform = window.navigator && window.navigator.platform ? window.navigator.platform : '';
        var maxTouchPoints = window.navigator && window.navigator.maxTouchPoints ? window.navigator.maxTouchPoints : 0;

        return /iPad|iPhone|iPod/.test(ua) || (platform === 'MacIntel' && maxTouchPoints > 1);
    }

    function initClientLogoCarousels(context) {
    var root = context || document;
    var carousels = root.querySelectorAll('.client-logos-slider__carousel');

    // ------------------------------------------
    // IMPORTANT: Do NOT run Flickity in the editor
    // ------------------------------------------
    // Gutenberg/ACF editor has body.block-editor-page.
    // We let the CSS handle a static preview there.
    if (document.body && document.body.classList.contains('block-editor-page')) {
        return;
    }

    if (!carousels.length) {
        return;
    }

        if (isIOSWebKit()) {
            carousels.forEach(function (carousel) {
                if (carousel.dataset.flickityInit === '1') {
                    return;
                }

                carousel.dataset.flickityInit = '1';
                carousel.classList.add('is-ready');
                carousel.classList.add('client-logos-slider__carousel--static');
                carousel.classList.add('client-logos-slider__carousel--ios-static');
            });
            return;
        }

    if (typeof Flickity === 'undefined') {
        return;
    }
        var prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        carousels.forEach(function (carousel) {
            // Avoid double-init
            if (carousel.dataset.flickityInit === '1') {
                return;
            }
            carousel.dataset.flickityInit = '1';

            // eslint-disable-next-line no-undef
            var flkty = new Flickity(carousel, {
                cellAlign: 'left',
                contain: false,
                wrapAround: true,
                freeScroll: true,
                autoPlay: false,
                pauseAutoPlayOnHover: false,
                prevNextButtons: false,
                pageDots: false,
                draggable: true
            });

            // ----- ticker setup ---------------------------------------------
            var baseTickerSpeed = 0.6; // desktop baseline
            var isPaused = prefersReducedMotion;
            var isInViewport = false;
            var tickerFrame = null;
            var tickerEnabled = true;

            // Basic responsive tweak
            var vw =
                window.innerWidth ||
                document.documentElement.clientWidth ||
                1440;

            if (vw < 768) {
                baseTickerSpeed *= 0.6;
            } else if (vw < 1024) {
                baseTickerSpeed *= 0.8;
            }

            var tickerSpeed = baseTickerSpeed;

            function shouldRunTicker() {
                return tickerEnabled && !isPaused && isInViewport && !document.hidden;
            }

            function stopTickerFrame() {
                if (tickerFrame) {
                    window.cancelAnimationFrame(tickerFrame);
                    tickerFrame = null;
                }
            }

            function scheduleTicker() {
                if (tickerFrame || !shouldRunTicker()) {
                    return;
                }

                tickerFrame = window.requestAnimationFrame(updateTicker);
            }

            function updateTicker() {
                tickerFrame = null;

                if (!shouldRunTicker()) {
                    return;
                }

                flkty.x -= tickerSpeed;
                flkty.positionSlider();
                flkty.velocity = -tickerSpeed;
                flkty.updateSelectedSlide();

                scheduleTicker();
            }

            carousel.addEventListener('mouseenter', function () {
                isPaused = true;
                stopTickerFrame();
            });

            carousel.addEventListener('mouseleave', function () {
                if (!prefersReducedMotion && tickerEnabled) {
                    isPaused = false;
                    scheduleTicker();
                }
            });

            document.addEventListener('visibilitychange', function () {
                if (document.hidden) {
                    stopTickerFrame();
                    return;
                }

                scheduleTicker();
            });

            function startTicker() {
                // -----------------------------------------------------------------
                // 1) Ensure we have enough cells by repeating the existing logos
                // -----------------------------------------------------------------
                var minCells = 12; // tweak this – 10–14 usually feels good
                var currentCells = flkty.getCellElements(); // DOM elements Flickity knows about

                if (currentCells.length && currentCells.length < minCells) {
                    // Take a snapshot of the original cells
                    var originals = Array.prototype.slice.call(currentCells);

                    // Keep duplicating until we reach at least minCells
                    while (flkty.getCellElements().length < minCells) {
                        originals.forEach(function (elem) {
                            // Clone the cell (including image + link)
                            var clone = elem.cloneNode(true);

                            // Append to the DOM
                            carousel.appendChild(clone);

                            // Tell Flickity about the new cell
                            flkty.append(clone);
                        });
                    }
                }

                // -----------------------------------------------------------------
                // 2) Normal ticker behaviour as before
                // -----------------------------------------------------------------

                tickerEnabled = true;

                // Reveal carousel
                carousel.classList.add('is-ready');

                // Only run ticker if user does not prefer reduced motion
                if (!prefersReducedMotion && tickerEnabled) {
                    isPaused = false;
                    scheduleTicker();
                }
            }

            if ('IntersectionObserver' in window) {
                var observer = new IntersectionObserver(
                    function (entries) {
                        entries.forEach(function (entry) {
                            isInViewport = entry.isIntersecting;
                            if (isInViewport) {
                                scheduleTicker();
                                return;
                            }

                            stopTickerFrame();
                        });
                    },
                    {
                        threshold: 0,
                        rootMargin: '160px 0px 160px 0px'
                    }
                );

                observer.observe(carousel);
            } else {
                isInViewport = true;
            }

            // Normal path: wait for Flickity's ready event.
            flkty.on('ready', startTicker);

            // Safety: if ready already fired synchronously, start on next frame.
            if (flkty.isActive) {
                window.requestAnimationFrame(startTicker);
            }
        });
    }

    // Front end + editor: init after DOM is ready.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initClientLogoCarousels();
        });
    } else {
        initClientLogoCarousels();
    }
})();
