(function () {
    var desktopQuery = window.matchMedia('(min-width: 960px)');
    var mobileQuery = window.matchMedia('(max-width: 959px)');
    var DESKTOP_CLOSE_MS = 1000;
    var MOBILE_SLIDE_MS = 280;

    function getTopLevelItems(nav) {
        return Array.from(
            nav.querySelectorAll('.wp-block-navigation__container > .wp-block-navigation-item')
        ).filter(function (item) {
            return !!getPanel(item);
        });
    }

    function getToggle(item) {
        return item.querySelector(':scope > .wp-block-navigation-submenu__toggle');
    }

    function getPanel(item) {
        return item.querySelector(':scope > .wp-block-navigation__submenu-container');
    }

    function setMegaTop(nav) {
        var header = nav.closest('header');
        var top = 0;

        if (header) {
            var rect = header.getBoundingClientRect();
            top = Math.max(rect.bottom, 0);
        }

        document.documentElement.style.setProperty('--icts-mega-top', top + 'px');
    }

    function setExpanded(item, expanded) {
        var toggle = getToggle(item);
        if (toggle) {
            var next = expanded ? 'true' : 'false';
            if (toggle.getAttribute('aria-expanded') !== next) {
                toggle.setAttribute('aria-expanded', next);
            }
        }
    }

    function setPanelHidden(item, hidden) {
        var panel = getPanel(item);
        if (!panel) {
            return;
        }

        if (hidden) {
            panel.setAttribute('hidden', 'hidden');
            return;
        }

        panel.removeAttribute('hidden');
    }

    function closeDesktopItem(item, immediate, done) {
        if (item._ictsCloseTimer) {
            window.clearTimeout(item._ictsCloseTimer);
            item._ictsCloseTimer = null;
        }

        var panel = getPanel(item);
        var panelStyles = panel ? window.getComputedStyle(panel) : null;
        var panelVisible = !!(
            panelStyles &&
            panelStyles.visibility !== 'hidden' &&
            parseFloat(panelStyles.opacity || '0') > 0
        );
        var isOpen = item.classList.contains('is-icts-mega-open');
        var isClosing = item.classList.contains('is-icts-mega-closing');

        if (!isOpen && !isClosing && !panelVisible) {
            if (typeof done === 'function') {
                done();
            }
            return;
        }

        if (!isOpen && panelVisible) {
            item.classList.add('is-icts-mega-open');
        }

        if (immediate) {
            item.classList.remove('is-icts-mega-closing');
            item.classList.remove('is-icts-mega-open');
            setExpanded(item, false);
            setPanelHidden(item, true);
            if (typeof done === 'function') {
                done();
            }
            return;
        }

        setPanelHidden(item, false);
        item.classList.add('is-icts-mega-closing');
        item._ictsCloseTimer = window.setTimeout(function () {
            item.classList.remove('is-icts-mega-closing');
            item.classList.remove('is-icts-mega-open');
            setExpanded(item, false);
            setPanelHidden(item, true);
            item._ictsCloseTimer = null;
            if (typeof done === 'function') {
                done();
            }
        }, DESKTOP_CLOSE_MS);
    }

    function closeDesktopAll(nav, immediate) {
        getTopLevelItems(nav).forEach(function (item) {
            closeDesktopItem(item, immediate);
        });
    }

    function openDesktopItem(item) {
        if (item._ictsCloseTimer) {
            window.clearTimeout(item._ictsCloseTimer);
            item._ictsCloseTimer = null;
        }

        setPanelHidden(item, false);
        item.classList.remove('is-icts-mega-closing');
        item.classList.add('is-icts-mega-open');

        setExpanded(item, true);
    }

    function closeMobilePanel(item, collapseToggle, immediate) {
        var panel = getPanel(item);
        if (panel) {
            if (panel._ictsMobileCloseTimer) {
                window.clearTimeout(panel._ictsMobileCloseTimer);
                panel._ictsMobileCloseTimer = null;
            }
            panel.classList.remove('is-icts-mobile-active');
            if (immediate) {
                panel.setAttribute('hidden', 'hidden');
            } else {
                panel._ictsMobileCloseTimer = window.setTimeout(function () {
                    panel.setAttribute('hidden', 'hidden');
                    panel._ictsMobileCloseTimer = null;
                }, MOBILE_SLIDE_MS);
            }
        }
        item.classList.remove('is-icts-mobile-open');

        if (collapseToggle) {
            var toggle = getToggle(item);
            if (toggle) {
                toggle.setAttribute('aria-expanded', 'false');
            }
        }
    }

    function prepareMobilePanels(nav) {
        var items = Array.from(nav.querySelectorAll('.wp-block-navigation-item')).filter(function (item) {
            return !!getPanel(item) && !!getToggle(item);
        });

        items.forEach(function (item) {
            var toggle = getToggle(item);
            var panel = getPanel(item);

            if (!toggle || !panel) {
                return;
            }

            panel.classList.add('icts-mobile-submenu-panel');
            panel.setAttribute('hidden', 'hidden');

            function openMobilePanel() {
                if (panel._ictsMobileCloseTimer) {
                    window.clearTimeout(panel._ictsMobileCloseTimer);
                    panel._ictsMobileCloseTimer = null;
                }
                panel.removeAttribute('hidden');
                panel.classList.add('is-icts-mobile-active');
                item.classList.add('is-icts-mobile-open');
            }

            function syncMobilePanelState() {
                if (!mobileQuery.matches) {
                    closeMobilePanel(item, false, true);
                    return;
                }

                var expanded = toggle.getAttribute('aria-expanded') === 'true';
                if (expanded) {
                    items.forEach(function (otherItem) {
                        if (otherItem !== item) {
                            closeMobilePanel(otherItem, true, false);
                        }
                    });
                    openMobilePanel();
                    return;
                }

                closeMobilePanel(item, false, false);
            }

            if (!panel.querySelector('.icts-mobile-submenu-back')) {
                var backButton = document.createElement('button');
                backButton.type = 'button';
                backButton.className = 'icts-mobile-submenu-back';
                backButton.textContent = 'Back';
                backButton.addEventListener('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    closeMobilePanel(item, true, false);
                });
                panel.prepend(backButton);
            }

            toggle.addEventListener('click', function () {
                if (!mobileQuery.matches) {
                    return;
                }

                window.setTimeout(function () {
                    syncMobilePanelState();
                }, 0);
            });

            var icon = item.querySelector(':scope > .wp-block-navigation__submenu-icon');
            if (icon) {
                icon.addEventListener('click', function (event) {
                    if (!mobileQuery.matches) {
                        return;
                    }

                    event.preventDefault();
                    event.stopPropagation();
                    toggle.click();
                });
            }

            var observer = new MutationObserver(function (mutations) {
                var ariaChanged = mutations.some(function (mutation) {
                    return mutation.type === 'attributes' && mutation.attributeName === 'aria-expanded';
                });

                if (ariaChanged) {
                    syncMobilePanelState();
                }
            });

            observer.observe(toggle, {
                attributes: true,
                attributeFilter: ['aria-expanded']
            });
        });
    }

    function watchResponsiveContainers(nav) {
        var containers = nav.querySelectorAll('.wp-block-navigation__responsive-container');

        containers.forEach(function (container) {
            var observer = new MutationObserver(function () {
                if (!container.classList.contains('is-menu-open')) {
                    container
                        .querySelectorAll('.is-icts-mobile-active')
                        .forEach(function (panel) {
                            panel.classList.remove('is-icts-mobile-active');
                            panel.setAttribute('hidden', 'hidden');
                        });
                    container
                        .querySelectorAll('.is-icts-mobile-open')
                        .forEach(function (item) {
                            item.classList.remove('is-icts-mobile-open');
                        });
                }
            });

            observer.observe(container, {
                attributes: true,
                attributeFilter: ['class']
            });
        });
    }

    function closeDesktopFromOutside(nav) {
        getTopLevelItems(nav).forEach(function (item) {
            closeDesktopItem(item, false);
        });
    }

    function initNavigation(nav) {
        if (nav.dataset.ictsMegaInit === 'true') {
            return;
        }

        nav.dataset.ictsMegaInit = 'true';
        var items = getTopLevelItems(nav);
        nav.classList.add('icts-nav-enhanced');
        setMegaTop(nav);
        prepareMobilePanels(nav);
        watchResponsiveContainers(nav);

        items.forEach(function (item) {
            var toggle = getToggle(item);
            var panel = getPanel(item);
            if (!toggle || !panel) {
                return;
            }

            item.classList.add('icts-nav-has-mega');
        });

        nav.addEventListener(
            'click',
            function (event) {
                if (!desktopQuery.matches) {
                    return;
                }

                if (event.target.closest('.wp-block-navigation__submenu-container')) {
                    return;
                }

                var clickedItem = event.target.closest(
                    '.wp-block-navigation__container > .wp-block-navigation-item.icts-nav-has-mega'
                );

                if (!clickedItem || !nav.contains(clickedItem)) {
                    return;
                }

                event.preventDefault();
                event.stopPropagation();

                var openItem = nav.querySelector(
                    '.wp-block-navigation__container > .wp-block-navigation-item.icts-nav-has-mega.is-icts-mega-open:not(.is-icts-mega-closing)'
                );

                if (openItem && openItem === clickedItem) {
                    closeDesktopItem(clickedItem, false);
                    return;
                }

                if (openItem && openItem !== clickedItem) {
                    closeDesktopItem(openItem, false, function () {
                        setMegaTop(nav);
                        openDesktopItem(clickedItem);
                    });
                    return;
                }

                setMegaTop(nav);
                openDesktopItem(clickedItem);
            },
            true
        );

        document.addEventListener('pointerdown', function (event) {
            if (!desktopQuery.matches) {
                return;
            }

            if (!nav.contains(event.target)) {
                closeDesktopFromOutside(nav);
                return;
            }

            if (event.target.closest('.wp-block-navigation__submenu-container')) {
                return;
            }

            if (
                event.target.closest(
                    '.wp-block-navigation__container > .wp-block-navigation-item.icts-nav-has-mega'
                )
            ) {
                return;
            }

            closeDesktopFromOutside(nav);
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                closeDesktopFromOutside(nav);
            }
        });
    }

    function init() {
        var navBlocks = document.querySelectorAll('.wp-block-navigation');
        if (!navBlocks.length) {
            return;
        }

        navBlocks.forEach(function (nav) {
            initNavigation(nav);
        });

        var setPositions = function () {
            navBlocks.forEach(function (nav) {
                setMegaTop(nav);
                if (!desktopQuery.matches) {
                    closeDesktopAll(nav, true);
                }
            });
        };

        window.addEventListener('resize', setPositions);
        window.addEventListener('scroll', setPositions, { passive: true });
    }

    document.addEventListener('DOMContentLoaded', init);
})();
