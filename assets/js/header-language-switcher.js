(function () {
    function getFocusableItems(menu) {
        if (!menu) {
            return [];
        }

        return Array.from(
            menu.querySelectorAll(
                'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
        );
    }

    function closeSwitcher(switcher, focusToggle) {
        if (!switcher) {
            return;
        }

        var toggle = switcher.querySelector('.icts-language-switcher__toggle');
        var menu = switcher.querySelector('.icts-language-switcher__menu');
        if (!toggle || !menu) {
            return;
        }

        switcher.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        menu.hidden = true;

        if (focusToggle) {
            try {
                toggle.focus();
            } catch (e) {
                // Ignore focus failures.
            }
        }
    }

    function closeAll(except) {
        document.querySelectorAll('[data-icts-language-switcher]').forEach(function (switcher) {
            if (except && switcher === except) {
                return;
            }

            closeSwitcher(switcher, false);
        });
    }

    function openSwitcher(switcher) {
        var toggle = switcher.querySelector('.icts-language-switcher__toggle');
        var menu = switcher.querySelector('.icts-language-switcher__menu');
        if (!toggle || !menu) {
            return;
        }

        closeAll(switcher);
        switcher.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        menu.hidden = false;
    }

    function initSwitcher(switcher) {
        if (!switcher || switcher.dataset.ictsLanguageSwitcherInit === '1') {
            return;
        }

        var toggle = switcher.querySelector('.icts-language-switcher__toggle');
        var menu = switcher.querySelector('.icts-language-switcher__menu');
        if (!toggle || !menu) {
            return;
        }

        switcher.dataset.ictsLanguageSwitcherInit = '1';

        if (!menu.id) {
            menu.id = 'icts-language-switcher-' + Math.random().toString(16).slice(2);
        }
        toggle.setAttribute('aria-controls', menu.id);
        toggle.setAttribute('aria-expanded', 'false');
        menu.hidden = true;

        toggle.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();

            var isOpen = switcher.classList.contains('is-open');
            if (isOpen) {
                closeSwitcher(switcher, false);
                return;
            }

            openSwitcher(switcher);
        });

        toggle.addEventListener('keydown', function (event) {
            if (
                event.key !== 'ArrowDown' &&
                event.key !== 'Enter' &&
                event.key !== ' '
            ) {
                return;
            }

            event.preventDefault();
            openSwitcher(switcher);

            var firstItem = getFocusableItems(menu)[0];
            if (firstItem) {
                try {
                    firstItem.focus();
                } catch (e) {
                    // Ignore focus failures.
                }
            }
        });

        menu.addEventListener('click', function (event) {
            if (!event.target.closest('a')) {
                return;
            }

            closeSwitcher(switcher, false);
        });

        menu.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                event.preventDefault();
                closeSwitcher(switcher, true);
            }
        });
    }

    function init() {
        document.querySelectorAll('[data-icts-language-switcher]').forEach(function (switcher) {
            initSwitcher(switcher);
        });

        document.addEventListener('click', function (event) {
            if (event.target.closest('[data-icts-language-switcher]')) {
                return;
            }

            closeAll(null);
        });

        document.addEventListener('keydown', function (event) {
            if (event.key !== 'Escape') {
                return;
            }

            closeAll(null);
        });
    }

    document.addEventListener('DOMContentLoaded', init);
})();
