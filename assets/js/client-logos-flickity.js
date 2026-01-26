(function () {
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

    if (!carousels.length || typeof Flickity === 'undefined') {
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

            function updateTicker() {
                if (!tickerEnabled) {
                    return; // static mode – no animation
                }

                if (isPaused) {
                    window.requestAnimationFrame(updateTicker);
                    return;
                }

                flkty.x -= tickerSpeed;
                flkty.positionSlider();
                flkty.velocity = -tickerSpeed;
                flkty.updateSelectedSlide();

                window.requestAnimationFrame(updateTicker);
            }

            carousel.addEventListener('mouseenter', function () {
                isPaused = true;
            });

            carousel.addEventListener('mouseleave', function () {
                if (!prefersReducedMotion && tickerEnabled) {
                    isPaused = false;
                }
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
                window.requestAnimationFrame(updateTicker);
            }
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