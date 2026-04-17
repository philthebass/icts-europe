(function () {
    /**
     * Initialise FAQ accordion blocks.
     *
     * @param {HTMLElement|Document} context
     */
    function initFaqAccordions(context) {
        var root = context || document;
        var accordions = root.querySelectorAll(
            '.js-icts-faq-accordion:not(.is-icts-faq-initialized)'
        );

        if (!accordions.length) {
            return;
        }

        var prefersReducedMotion = !!(
            window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        );

        accordions.forEach(function (accordion) {
            accordion.classList.add('is-icts-faq-initialized');

            var itemList = accordion.querySelector('[data-icts-faq-items]');
            var searchInput = accordion.querySelector('[data-icts-faq-search]');
            var searchControl = accordion.querySelector('[data-icts-faq-search-control]');
            var searchClearButton = accordion.querySelector('[data-icts-faq-search-clear]');
            var categorySelect = accordion.querySelector('[data-icts-faq-category]');
            var showAllButton = accordion.querySelector('[data-icts-faq-show-all]');
            var emptyMessage = accordion.querySelector('[data-icts-faq-empty]');
            var searchDebounceTimer = null;
            var initialLimit = itemList
                ? parseInt(itemList.getAttribute('data-icts-faq-limit') || '0', 10)
                : 0;
            var hasExpandedAll = false;
            var items = itemList
                ? Array.prototype.slice.call(
                      itemList.querySelectorAll('.icts-faq-accordion__item')
                  )
                : [];

            if (isNaN(initialLimit) || initialLimit < 1) {
                initialLimit = 0;
            }

            function normalizeText(value) {
                return String(value || '').trim().toLowerCase();
            }

            function setExpanded(item, expanded) {
                var toggle = item.querySelector('[data-icts-faq-toggle]');
                var panel = item.querySelector('[data-icts-faq-panel]');

                if (!toggle || !panel) {
                    return;
                }

                if (expanded) {
                    item.classList.add('is-open');
                    toggle.setAttribute('aria-expanded', 'true');
                    panel.hidden = false;

                    if (prefersReducedMotion) {
                        panel.style.maxHeight = 'none';
                        panel.style.opacity = '1';
                        return;
                    }

                    panel.style.maxHeight = '0px';
                    panel.style.opacity = '0';

                    window.requestAnimationFrame(function () {
                        panel.style.maxHeight = panel.scrollHeight + 'px';
                        panel.style.opacity = '1';
                    });

                    var onOpenTransitionEnd = function (event) {
                        if (event.propertyName !== 'max-height') {
                            return;
                        }

                        panel.style.maxHeight = 'none';
                        panel.removeEventListener('transitionend', onOpenTransitionEnd);
                    };

                    panel.addEventListener('transitionend', onOpenTransitionEnd);
                    return;
                }

                item.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');

                if (prefersReducedMotion) {
                    panel.style.maxHeight = '0px';
                    panel.style.opacity = '0';
                    panel.hidden = true;
                    return;
                }

                if (panel.style.maxHeight === 'none' || !panel.style.maxHeight) {
                    panel.style.maxHeight = panel.scrollHeight + 'px';
                }

                window.requestAnimationFrame(function () {
                    panel.style.maxHeight = '0px';
                    panel.style.opacity = '0';
                });

                var onCloseTransitionEnd = function (event) {
                    if (event.propertyName !== 'max-height') {
                        return;
                    }

                    panel.hidden = true;
                    panel.removeEventListener('transitionend', onCloseTransitionEnd);
                };

                panel.addEventListener('transitionend', onCloseTransitionEnd);
            }

            function closeOtherItems(currentItem) {
                items.forEach(function (item) {
                    if (item !== currentItem && item.classList.contains('is-open')) {
                        setExpanded(item, false);
                    }
                });
            }

            function updateSearchClearButton() {
                if (!searchInput || !searchClearButton) {
                    return;
                }

                var hasValue = searchInput.value !== '';

                searchClearButton.hidden = !hasValue;

                if (searchControl) {
                    searchControl.classList.toggle('has-value', hasValue);
                }
            }

            function applyFilters() {
                var searchTerm = searchInput ? normalizeText(searchInput.value) : '';
                var selectedCategory = categorySelect
                    ? String(categorySelect.value || '0')
                    : '0';
                var matchingCount = 0;
                var renderedVisibleCount = 0;

                items.forEach(function (item) {
                    var searchIndex = normalizeText(
                        item.getAttribute('data-icts-faq-search-index')
                    );
                    var categoriesCsv = String(
                        item.getAttribute('data-icts-faq-categories') || ''
                    );
                    var categoryIds = categoriesCsv
                        ? categoriesCsv.split(',').map(function (value) {
                              return String(value).trim();
                          })
                        : [];

                    var matchesSearch = !searchTerm || searchIndex.indexOf(searchTerm) !== -1;
                    var matchesCategory =
                        selectedCategory === '0' ||
                        categoryIds.indexOf(selectedCategory) !== -1;
                    var isMatching = matchesSearch && matchesCategory;
                    var isVisible = false;

                    if (isMatching) {
                        matchingCount += 1;
                        isVisible =
                            hasExpandedAll ||
                            initialLimit < 1 ||
                            renderedVisibleCount < initialLimit;

                        if (isVisible) {
                            renderedVisibleCount += 1;
                        }
                    }

                    item.hidden = !isVisible;
                    if (!isVisible && item.classList.contains('is-open')) {
                        setExpanded(item, false);
                    }
                });

                if (showAllButton) {
                    showAllButton.hidden =
                        hasExpandedAll || initialLimit < 1 || matchingCount <= initialLimit;
                }

                if (emptyMessage) {
                    emptyMessage.hidden = matchingCount !== 0;
                }
            }

            items.forEach(function (item) {
                var toggle = item.querySelector('[data-icts-faq-toggle]');
                var panel = item.querySelector('[data-icts-faq-panel]');

                if (!toggle || !panel) {
                    return;
                }

                item.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
                panel.hidden = true;
                panel.style.maxHeight = '0px';
                panel.style.opacity = '0';

                toggle.addEventListener('click', function () {
                    var isOpen = item.classList.contains('is-open');

                    if (isOpen) {
                        setExpanded(item, false);
                        return;
                    }

                    closeOtherItems(item);
                    setExpanded(item, true);
                });
            });

            if (searchInput) {
                searchInput.addEventListener('input', function () {
                    updateSearchClearButton();

                    if (searchDebounceTimer) {
                        window.clearTimeout(searchDebounceTimer);
                    }
                    searchDebounceTimer = window.setTimeout(applyFilters, 180);
                });
            }

            if (searchClearButton && searchInput) {
                searchClearButton.addEventListener('click', function () {
                    if (searchDebounceTimer) {
                        window.clearTimeout(searchDebounceTimer);
                    }

                    searchInput.value = '';
                    updateSearchClearButton();
                    applyFilters();
                    searchInput.focus();
                });
            }

            if (categorySelect) {
                categorySelect.addEventListener('change', applyFilters);
            }

            if (showAllButton) {
                showAllButton.addEventListener('click', function () {
                    hasExpandedAll = true;
                    applyFilters();
                });
            }

            updateSearchClearButton();
            applyFilters();
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initFaqAccordions(document);
    });

    if (window.acf && typeof window.acf.addAction === 'function') {
        window.acf.addAction(
            'render_block_preview/type=faq-accordion',
            function ($block) {
                if ($block && $block[0]) {
                    initFaqAccordions($block[0]);
                }
            }
        );
    }

    if (typeof window !== 'undefined') {
        window.ICTS = window.ICTS || {};
        window.ICTS.initFaqAccordions = initFaqAccordions;
    }
})();
