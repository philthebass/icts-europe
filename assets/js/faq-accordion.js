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
            var items = itemList
                ? Array.prototype.slice.call(
                      itemList.querySelectorAll('.icts-faq-accordion__item')
                  )
                : [];

            var emptyState = accordion.querySelector('[data-icts-faq-empty]');

            var productFilter = accordion.querySelector(
                '[data-icts-faq-filter="product"]'
            );
            var customerFilter = accordion.querySelector(
                '[data-icts-faq-filter="customer"]'
            );

            var defaultProduct = accordion.getAttribute('data-default-product') || '';
            var defaultCustomer = accordion.getAttribute('data-default-customer') || '';

            if (productFilter && defaultProduct && !productFilter.value) {
                productFilter.value = defaultProduct;
            }
            if (customerFilter && defaultCustomer && !customerFilter.value) {
                customerFilter.value = defaultCustomer;
            }

            function getTerms(value) {
                if (!value) {
                    return [];
                }

                return value
                    .split('|')
                    .map(function (term) {
                        return term.trim();
                    })
                    .filter(Boolean);
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

            items.forEach(function (item) {
                var toggle = item.querySelector('[data-icts-faq-toggle]');
                var panel = item.querySelector('[data-icts-faq-panel]');

                if (!toggle || !panel) {
                    return;
                }

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

            function applyFilters() {
                if (!items.length) {
                    return;
                }

                var selectedProduct = productFilter ? productFilter.value : '';
                var selectedCustomer = customerFilter ? customerFilter.value : '';
                var visibleCount = 0;

                items.forEach(function (item) {
                    var productTerms = getTerms(item.getAttribute('data-product-terms'));
                    var customerTerms = getTerms(item.getAttribute('data-customer-terms'));

                    var matchesProduct =
                        !selectedProduct || productTerms.indexOf(selectedProduct) !== -1;
                    var matchesCustomer =
                        !selectedCustomer || customerTerms.indexOf(selectedCustomer) !== -1;
                    var isMatch = matchesProduct && matchesCustomer;

                    item.hidden = !isMatch;
                    item.classList.toggle('is-filtered-out', !isMatch);

                    if (!isMatch && item.classList.contains('is-open')) {
                        setExpanded(item, false);
                    }

                    if (isMatch) {
                        visibleCount += 1;
                    }
                });

                if (emptyState) {
                    emptyState.hidden = visibleCount !== 0;
                }
            }

            if (productFilter) {
                productFilter.addEventListener('change', applyFilters);
            }
            if (customerFilter) {
                customerFilter.addEventListener('change', applyFilters);
            }

            applyFilters();
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initFaqAccordions(document);
    });

    if (typeof window !== 'undefined') {
        window.ICTS = window.ICTS || {};
        window.ICTS.initFaqAccordions = initFaqAccordions;
    }
})();
