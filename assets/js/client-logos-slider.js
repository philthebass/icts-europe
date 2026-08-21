(function () {
    'use strict';

    var SELECTOR = '.client-logos-slider__carousel';
    var SPEED = 36;
    var DRAG_THRESHOLD = 10;

    function initCarousel(carousel) {
        if (carousel.dataset.marqueeInit === '1') {
            return;
        }

        var logoCount = parseInt(carousel.dataset.logoCount || '0', 10);
        var cells = carousel.querySelectorAll('.client-logos-slider__cell');

        if (logoCount < 2 || cells.length <= logoCount) {
            return;
        }

        carousel.dataset.marqueeInit = '1';

        var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        var offset = 0;
        var loopWidth = 0;
        var lastTime = 0;
        var frame = 0;
        var hovered = false;
        var focused = false;
        var pointerActive = false;
        var dragging = false;
        var dragged = false;
        var pointerId = null;
        var pointerStartX = 0;
        var pointerStartOffset = 0;

        function measure() {
            var duplicateStart = cells[logoCount];
            loopWidth = duplicateStart ? duplicateStart.offsetLeft - cells[0].offsetLeft : 0;
            normalizeOffset();
            render();
        }

        function normalizeOffset() {
            if (!loopWidth) {
                return;
            }

            offset = ((offset % loopWidth) + loopWidth) % loopWidth;
        }

        function render() {
            carousel.style.transform = 'translate3d(' + (-offset) + 'px, 0, 0)';
        }

        function isPaused() {
            return reducedMotion.matches || hovered || focused || pointerActive || document.hidden;
        }

        function tick(time) {
            if (!lastTime) {
                lastTime = time;
            }

            if (!isPaused() && loopWidth) {
                offset += SPEED * Math.min((time - lastTime) / 1000, 0.05);
                normalizeOffset();
                render();
            }

            lastTime = time;
            frame = window.requestAnimationFrame(tick);
        }

        carousel.addEventListener('mouseenter', function () {
            hovered = true;
        });

        carousel.addEventListener('mouseleave', function () {
            hovered = false;
        });

        carousel.addEventListener('focusin', function () {
            focused = true;
        });

        carousel.addEventListener('focusout', function () {
            focused = carousel.contains(document.activeElement);
        });

        carousel.addEventListener('pointerdown', function (event) {
            if (event.button !== undefined && event.button !== 0) {
                return;
            }

            pointerActive = true;
            dragging = false;
            dragged = false;
            pointerId = event.pointerId;
            pointerStartX = event.clientX;
            pointerStartOffset = offset;
        });

        carousel.addEventListener('pointermove', function (event) {
            if (!pointerActive || event.pointerId !== pointerId) {
                return;
            }

            var distance = event.clientX - pointerStartX;

            if (!dragging && Math.abs(distance) < DRAG_THRESHOLD) {
                return;
            }

            if (!dragging) {
                dragging = true;
                dragged = true;
                carousel.classList.add('is-dragging');
                carousel.setPointerCapture(pointerId);
            }

            offset = pointerStartOffset - distance;
            normalizeOffset();
            render();
        });

        function endDrag(event) {
            if (!pointerActive || event.pointerId !== pointerId) {
                return;
            }

            pointerActive = false;
            dragging = false;
            carousel.classList.remove('is-dragging');

            if (carousel.hasPointerCapture(pointerId)) {
                carousel.releasePointerCapture(pointerId);
            }

            pointerId = null;
        }

        window.addEventListener('pointerup', endDrag);
        window.addEventListener('pointercancel', endDrag);
        carousel.addEventListener('click', function (event) {
            if (dragged) {
                event.preventDefault();
                event.stopPropagation();
                dragged = false;
            }
        }, true);

        window.addEventListener('resize', measure);
        document.addEventListener('visibilitychange', function () {
            lastTime = 0;
        });

        carousel.classList.add('is-marquee-ready');
        measure();
        frame = window.requestAnimationFrame(tick);
    }

    function init() {
        document.querySelectorAll(SELECTOR).forEach(initCarousel);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}());
