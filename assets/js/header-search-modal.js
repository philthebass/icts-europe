(function () {
    var TRANSITION_MS = 240;

    function initSearchModal(modal) {
        if (!modal || !modal.id || modal.dataset.ictsSearchInit === '1') {
            return;
        }

        modal.dataset.ictsSearchInit = '1';
        var modalId = modal.id;
        var triggers = Array.from(
            document.querySelectorAll(
                '.icts-site-header__search-toggle[aria-controls="' + modalId + '"], ' +
                '.icts-site-header__search-toggle .wp-block-button__link'
            )
        );
        if (!triggers.length) {
            return;
        }

        triggers.forEach(function (trigger) {
            if (!trigger.getAttribute('aria-controls')) {
                trigger.setAttribute('aria-controls', modalId);
            }
            if (!trigger.getAttribute('aria-expanded')) {
                trigger.setAttribute('aria-expanded', 'false');
            }
        });

        var closeControls = Array.from(modal.querySelectorAll('[data-icts-search-close]'));
        var input = modal.querySelector('.wp-block-search__input');
        var closeTimer = null;
        var activeTrigger = null;

        function clearCloseTimer() {
            if (closeTimer) {
                window.clearTimeout(closeTimer);
                closeTimer = null;
            }
        }

        function setExpandedState(expanded) {
            var value = expanded ? 'true' : 'false';
            triggers.forEach(function (trigger) {
                trigger.setAttribute('aria-expanded', value);
            });
        }

        function openModal(trigger) {
            clearCloseTimer();
            modal.hidden = false;
            modal.classList.remove('is-closing');
            modal.classList.add('is-active');
            setExpandedState(true);
            activeTrigger = trigger || null;
            document.body.classList.add('icts-search-modal-open');

            if (input) {
                window.setTimeout(function () {
                    try {
                        input.focus();
                    } catch (e) {
                        // Ignore focus failures.
                    }
                }, 40);
            }
        }

        function closeModal() {
            if (modal.hidden) {
                return;
            }

            modal.classList.remove('is-active');
            modal.classList.add('is-closing');
            setExpandedState(false);
            document.body.classList.remove('icts-search-modal-open');

            clearCloseTimer();
            closeTimer = window.setTimeout(function () {
                modal.classList.remove('is-closing');
                modal.hidden = true;
                if (activeTrigger) {
                    try {
                        activeTrigger.focus();
                    } catch (e) {
                        // Ignore focus failures.
                    }
                }
                activeTrigger = null;
            }, TRANSITION_MS);
        }

        triggers.forEach(function (trigger) {
            trigger.addEventListener('click', function (event) {
                event.preventDefault();

                if (modal.hidden) {
                    openModal(trigger);
                    return;
                }

                closeModal();
            });
        });

        closeControls.forEach(function (control) {
            control.addEventListener('click', function (event) {
                event.preventDefault();
                closeModal();
            });
        });

        document.addEventListener('keydown', function (event) {
            if (event.key !== 'Escape' || modal.hidden) {
                return;
            }

            closeModal();
        });
    }

    function init() {
        document
            .querySelectorAll('.icts-header-search-modal')
            .forEach(function (modal) {
                initSearchModal(modal);
            });
    }

    document.addEventListener('DOMContentLoaded', init);
})();
