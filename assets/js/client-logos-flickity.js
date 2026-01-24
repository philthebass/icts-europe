(function () {
    function initClientLogoCarousels(context) {
        var root = context || document;
        var carousels = root.querySelectorAll('.client-logos-slider__carousel');

        if (!carousels.length || typeof Flickity === 'undefined') {
            return;
        }

        var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        carousels.forEach(function (carousel) {
            // Avoid double init.
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

            // Optional: very rough responsive tweak (slightly slower on narrow screens)
            var vw = window.innerWidth || document.documentElement.clientWidth || 1440;
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
    // Measure total width of all cells vs viewport.
    var viewportWidth = flkty.size.innerWidth;
    var cellsWidth = 0;

    flkty.cells.forEach(function (cell) {
        cellsWidth += cell.size.outerWidth;
    });

    // If the row is shorter than the viewport,
    // disable ticker and fall back to a simple centred row.
    if (cellsWidth <= viewportWidth) {
        tickerEnabled = false;

        // Tear down Flickity so it stops controlling layout
        flkty.destroy();

        // Reveal carousel and mark it as static
        carousel.classList.add('is-ready', 'client-logos-slider__carousel--static');

        return; // no ticker
    }

    // Otherwise: normal ticker behaviour
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

    // Front end: init after DOM is ready.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initClientLogoCarousels();
        });
    } else {
        initClientLogoCarousels();
    }

    // ACF block preview in the editor.
    if (window.acf && typeof window.acf.addAction === 'function') {
        window.acf.addAction(
            'render_block_preview/type=client-logos-slider',
            function ($block) {
                var el = $block[0] || $block;
                initClientLogoCarousels(el);
            }
        );
    }
})();