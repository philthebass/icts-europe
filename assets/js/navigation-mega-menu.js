(function () {
    // Simple runtime marker to confirm the latest script is loaded in the browser.
    // Update when debugging version/caching issues.
    window.__ICTS_NAV_MEGA_MENU_VERSION = '2026-02-12-back-debug-1';

    var desktopQuery = window.matchMedia('(min-width: 960px)');
    var mobileQuery = window.matchMedia('(max-width: 959px)');
    var DESKTOP_CLOSE_MS = 1000;
    var MOBILE_SLIDE_MS = 280;

    var debugEnabled = false;
    try {
        debugEnabled = window.localStorage && window.localStorage.getItem('ictsNavDebug') === '1';
    } catch (e) {
        debugEnabled = false;
    }

    function debugLog() {
        if (!debugEnabled) {
            return;
        }
        // eslint-disable-next-line no-console
        console.log.apply(console, arguments);
    }

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

    function revealMobileParent(mobileContainer) {
        if (!mobileContainer) {
            return;
        }

        debugLog('[ictsNav] revealMobileParent()', Date.now());
        mobileContainer._ictsRevealScheduled = false;
        // Ensure we don't leave an "entering" animation stuck on the parent list.
        if (mobileContainer._ictsMobileEnterTimer) {
            window.clearTimeout(mobileContainer._ictsMobileEnterTimer);
            mobileContainer._ictsMobileEnterTimer = null;
        }

        mobileContainer.classList.remove('is-icts-mobile-container-entering');
        // Keep hidden until the next frame to avoid any flash.
        mobileContainer.classList.add('is-icts-mobile-container-hidden');
        mobileContainer.classList.add('is-icts-mobile-container-entering');

        window.requestAnimationFrame(function () {
            // Restart animation reliably.
            void mobileContainer.offsetWidth;
            mobileContainer.classList.remove('is-icts-mobile-container-hidden');

            mobileContainer._ictsMobileEnterTimer = window.setTimeout(function () {
                mobileContainer.classList.remove('is-icts-mobile-container-entering');
                mobileContainer._ictsMobileEnterTimer = null;
            }, MOBILE_SLIDE_MS);
        });
    }

    function closeMobilePanel(item, collapseToggle, immediate, revealParent) {
        var panel = getPanel(item);
        var mobileContainer = item.closest('.wp-block-navigation__container');
        var itemLabel = '';
        try {
            var labelEl = item.querySelector(
                ':scope > .wp-block-navigation-item__content .wp-block-navigation-item__label'
            );
            if (labelEl) {
                itemLabel = String(labelEl.textContent || '').trim();
            }
        } catch (e) {
            // ignore
        }
        debugLog('[ictsNav] closeMobilePanel()', {
            now: Date.now(),
            label: itemLabel,
            immediate: immediate,
            revealParent: revealParent,
            expanded: (getToggle(item) || {}).getAttribute ? getToggle(item).getAttribute('aria-expanded') : null
        });
        if (panel) {
            var isActive = panel.classList.contains('is-icts-mobile-active');
            var isClosing = panel.classList.contains('is-icts-mobile-closing');

            // If nothing is visible, don't try to "animate" a panel that is already off-canvas.
            if (!immediate && !isActive && !isClosing) {
                if (revealParent && mobileContainer && !mobileContainer._ictsRevealScheduled) {
                    mobileContainer._ictsRevealScheduled = true;
                    revealMobileParent(mobileContainer);
                }
                item.classList.remove('is-icts-mobile-open');
                if (collapseToggle) {
                    var toggleNoAnim = getToggle(item);
                    if (toggleNoAnim) {
                        toggleNoAnim.setAttribute('aria-expanded', 'false');
                    }
                }
                return;
            }

            if (panel._ictsMobileCloseTimer) {
                window.clearTimeout(panel._ictsMobileCloseTimer);
                panel._ictsMobileCloseTimer = null;
            }
            if (immediate) {
                panel.classList.remove('is-icts-mobile-closing');
                panel.classList.remove('is-icts-mobile-active');
                panel.setAttribute('hidden', 'hidden');
                if (revealParent && mobileContainer && !mobileContainer._ictsRevealScheduled) {
                    mobileContainer._ictsRevealScheduled = true;
                    revealMobileParent(mobileContainer);
                }
            } else {
                panel.removeAttribute('hidden');
                panel.classList.add('is-icts-mobile-closing');
                panel.classList.remove('is-icts-mobile-active');
                panel._ictsMobileCloseTimer = window.setTimeout(function () {
                    panel.classList.remove('is-icts-mobile-closing');
                    panel.setAttribute('hidden', 'hidden');
                    panel._ictsMobileCloseTimer = null;
                    if (revealParent && mobileContainer && !mobileContainer._ictsRevealScheduled) {
                        mobileContainer._ictsRevealScheduled = true;
                        debugLog('[ictsNav] panel close complete -> reveal', Date.now());
                        revealMobileParent(mobileContainer);
                    }
                }, MOBILE_SLIDE_MS);
            }
        }
        item.classList.remove('is-icts-mobile-open');

        if (mobileContainer) {
            // Clean up any pending parent-enter animation whenever a panel closes.
            if (mobileContainer._ictsMobileEnterTimer) {
                window.clearTimeout(mobileContainer._ictsMobileEnterTimer);
                mobileContainer._ictsMobileEnterTimer = null;
            }
        }

        if (collapseToggle) {
            var toggle = getToggle(item);
            if (toggle) {
                toggle.setAttribute('aria-expanded', 'false');
            }
        }
    }

    function prepareMobilePanels(nav) {
        // Only enhance the responsive (mobile) copy of the navigation to avoid double-binding
        // on desktop markup and/or duplicated lists.
        var items = Array.from(
            nav.querySelectorAll('.wp-block-navigation__responsive-container-content .wp-block-navigation-item')
        ).filter(function (item) {
            return !!getPanel(item) && !!getToggle(item);
        });

        items.forEach(function (item) {
            if (item.dataset.ictsMobilePrepared === '1') {
                return;
            }
            item.dataset.ictsMobilePrepared = '1';

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

                var mobileContainer = item.closest('.wp-block-navigation__container');
                if (mobileContainer) {
                    mobileContainer.classList.add('is-icts-mobile-container-hidden');
                }
            }

            function syncMobilePanelState() {
                if (!mobileQuery.matches) {
                    closeMobilePanel(item, false, true, false);
                    return;
                }

                var expanded = toggle.getAttribute('aria-expanded') === 'true';
                if (expanded) {
                    items.forEach(function (otherItem) {
                        if (otherItem !== item) {
                            var otherPanel = getPanel(otherItem);
                            var otherOpen =
                                otherItem.classList.contains('is-icts-mobile-open') ||
                                (otherPanel && otherPanel.classList.contains('is-icts-mobile-active'));
                            if (!otherOpen) {
                                return;
                            }
                            // Switching panels: keep parent hidden; don't "enter" between panels.
                            closeMobilePanel(otherItem, true, false, false);
                        }
                    });
                    openMobilePanel();
                    return;
                }

                // Explicit collapse (e.g. tap the open item again): return to parent.
                closeMobilePanel(item, false, false, true);
            }

            if (!panel.querySelector('.icts-mobile-submenu-back')) {
                var backButton = document.createElement('button');
                backButton.type = 'button';
                backButton.className = 'icts-mobile-submenu-back';
                backButton.textContent = 'Back';
                backButton.addEventListener(
                    'pointerdown',
                    function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        if (typeof event.stopImmediatePropagation === 'function') {
                            event.stopImmediatePropagation();
                        }
                    },
                    true
                );
                backButton.addEventListener(
                    'click',
                    function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        if (typeof event.stopImmediatePropagation === 'function') {
                            event.stopImmediatePropagation();
                        }

                        // Drive "Back" ourselves (do not rely on core/navigation toggling `[hidden]`).
                        toggle.setAttribute('aria-expanded', 'false');
                        closeMobilePanel(item, false, false, true);

                        // After the submenu slides out and parent becomes visible, restore focus.
                        window.setTimeout(function () {
                            try {
                                toggle.focus();
                            } catch (e) {
                                // Ignore focus failures (e.g. element removed).
                            }
                        }, MOBILE_SLIDE_MS + 20);
                    },
                    true
                );
                panel.prepend(backButton);
            }

            // IMPORTANT: When collapsing, core/navigation sets `[hidden]` immediately, which kills CSS transitions.
            // Intercept "close" clicks in the capture phase and run our own closing animation.
            if (toggle.dataset.ictsMobileCloseIntercept !== '1') {
                toggle.dataset.ictsMobileCloseIntercept = '1';
                toggle.addEventListener(
                    'click',
                    function (event) {
                        if (!mobileQuery.matches) {
                            return;
                        }

                        // Pre-click state: if expanded, this click intends to close.
                        if (toggle.getAttribute('aria-expanded') !== 'true') {
                            return;
                        }

                        event.preventDefault();
                        event.stopPropagation();
                        if (typeof event.stopImmediatePropagation === 'function') {
                            event.stopImmediatePropagation();
                        }

                        // Keep ARIA in sync, but prevent core from immediately hiding the panel.
                        toggle.setAttribute('aria-expanded', 'false');
                        closeMobilePanel(item, false, false, true);
                    },
                    true
                );
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
        });
    }

    function watchResponsiveContainers(nav) {
        var containers = nav.querySelectorAll('.wp-block-navigation__responsive-container');

        containers.forEach(function (container) {
            var observer = new MutationObserver(function () {
                if (!container.classList.contains('is-menu-open')) {
                    var menuContainer = container.querySelector('.wp-block-navigation__container');
                    if (menuContainer) {
                        menuContainer.classList.remove('is-icts-mobile-container-hidden');
                        menuContainer.classList.remove('is-icts-mobile-container-entering');
                        if (menuContainer._ictsMobileEnterTimer) {
                            window.clearTimeout(menuContainer._ictsMobileEnterTimer);
                            menuContainer._ictsMobileEnterTimer = null;
                        }
                    }
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

        nav.addEventListener(
            'click',
            function (event) {
                if (!mobileQuery.matches) {
                    return;
                }

                var responsiveContainer = event.target.closest(
                    '.wp-block-navigation__responsive-container.is-menu-open'
                );
                if (!responsiveContainer || !nav.contains(responsiveContainer)) {
                    return;
                }

                // If the user taps the chevron "column" (56px wide), treat it as a toggle click.
                // WordPress' nav markup/CSS can sometimes make the `<span>` non-interactive on touch.
                var item = event.target.closest('.wp-block-navigation-item.has-child');
                if (!item) {
                    return;
                }

                // Don't interfere with normal toggle clicks or submenu link clicks.
                if (event.target.closest('.wp-block-navigation-submenu__toggle')) {
                    return;
                }
                if (event.target.closest('.wp-block-navigation__submenu-container')) {
                    return;
                }

                var icon = event.target.closest('.wp-block-navigation__submenu-icon');
                var treatAsChevronTap = !!icon;

                if (!treatAsChevronTap) {
                    var rect = item.getBoundingClientRect();
                    var chevronWidth = 56;
                    var x = event.clientX;
                    if (document.documentElement.dir === 'rtl') {
                        treatAsChevronTap = x <= rect.left + chevronWidth;
                    } else {
                        treatAsChevronTap = x >= rect.right - chevronWidth;
                    }
                }

                if (!treatAsChevronTap) {
                    return;
                }

                var toggle = getToggle(item);
                if (!toggle) {
                    return;
                }

                event.preventDefault();
                event.stopPropagation();
                toggle.click();
            },
            true
        );

        nav.addEventListener(
            'click',
            function (event) {
                if (!mobileQuery.matches) {
                    return;
                }

                var closeButton = event.target.closest('.wp-block-navigation__responsive-container-close');
                if (!closeButton) {
                    return;
                }

                // Allow the second, synthetic click through.
                if (closeButton.dataset.ictsBypassClose === '1') {
                    delete closeButton.dataset.ictsBypassClose;
                    return;
                }

                var responsiveContainer = closeButton.closest('.wp-block-navigation__responsive-container.is-menu-open');
                if (!responsiveContainer || !nav.contains(responsiveContainer)) {
                    return;
                }

                var content = responsiveContainer.querySelector('.wp-block-navigation__responsive-container-content');
                if (!content) {
                    return;
                }

                event.preventDefault();
                event.stopPropagation();
                if (typeof event.stopImmediatePropagation === 'function') {
                    event.stopImmediatePropagation();
                }

                content.classList.add('is-icts-mobile-exiting');
                responsiveContainer.classList.add('is-icts-mobile-overlay-exiting');

                window.setTimeout(function () {
                    content.classList.remove('is-icts-mobile-exiting');
                    responsiveContainer.classList.remove('is-icts-mobile-overlay-exiting');
                    closeButton.dataset.ictsBypassClose = '1';
                    closeButton.click();
                }, MOBILE_SLIDE_MS);
            },
            true
        );

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
