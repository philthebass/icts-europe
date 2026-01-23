(function () {
    function initClientLogoCarousels(context) {
        var root = context || document;
        var carousels = root.querySelectorAll('.client-logos-slider__carousel');

        if (!carousels.length || typeof Flickity === 'undefined') {
            return;
        }

        var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Helper: responsive ticker speed
        function getTickerSpeed() {
            // You can tweak these values/breakpoints to taste
            if (window.matchMedia('(max-width: 480px)').matches) {
                // Small phones
                return 1.0;
            }
            if (window.matchMedia('(max-width: 768px)').matches) {
                // Larger phones / small tablets
                return 0.8;
            }
            // Desktop / large screens
            return 0.6;
        }

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

            // Pick speed based on current viewport
            var tickerSpeed = getTickerSpeed();
            var isPaused = prefersReducedMotion;

            function updateTicker() {
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
                if (!prefersReducedMotion) {
                    isPaused = false;
                }
            });

            function startTicker() {
                if (!carousel.classList.contains('is-ready')) {
                    carousel.classList.add('is-ready');
                }

                if (!prefersReducedMotion) {
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

            // OPTIONAL: adapt speed on resize (nice for dev tools / orientation change)
            window.addEventListener('resize', function () {
                tickerSpeed = getTickerSpeed();
            });
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