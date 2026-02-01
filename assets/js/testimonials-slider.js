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

            // eslint-disable-next-line no-new
            new Flickity(slider, {
                cellAlign: 'center',
                contain: false,
                wrapAround: true,
                pageDots: true,
                prevNextButtons: true,
                adaptiveHeight: true,
                // autoplay every 5 seconds
                autoPlay: 5000,
                pauseAutoPlayOnHover: true
            });
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