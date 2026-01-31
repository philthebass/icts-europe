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
                cellAlign: 'left',
                contain: true,
                wrapAround: true,
                pageDots: true,
                prevNextButtons: true,
                adaptiveHeight: true
            });
        });
    }

    // Front-end: run after DOM is ready.
    document.addEventListener('DOMContentLoaded', function () {
        initTestimonialsSliders(document);
    });

    // Block editor (ACF): run whenever the block preview is rendered.
    if (window.acf && typeof window.acf.addAction === 'function') {
        window.acf.addAction(
            'render_block_preview/type=testimonials-slider',
            function ($block) {
                // $block is a jQuery object in the editor.
                if ($block && $block[0]) {
                    initTestimonialsSliders($block[0]);
                }
            }
        );
    }
})();