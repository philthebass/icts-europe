(function () {
    'use strict';

    function init(select) {
        var id = select.id;
        var options = Array.from(select.options);
        var active = select.selectedIndex;
        var search = '';
        var searchTimer;
        var wrapper = document.createElement('div');
        wrapper.className = 'icts-category-colour-picker';
        var button = document.createElement('button');
        button.type = 'button';
        button.id = id;
        button.className = 'icts-category-colour-button';
        button.setAttribute('role', 'combobox');
        button.setAttribute('aria-haspopup', 'listbox');
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-controls', id + '-options');
        button.setAttribute('aria-labelledby', 'icts-category-colour-label ' + id + '-value');
        button.setAttribute('aria-describedby', select.getAttribute('aria-describedby'));
        var list = document.createElement('div');
        list.id = id + '-options';
        list.className = 'icts-category-colour-options';
        list.setAttribute('role', 'listbox');
        list.setAttribute('aria-labelledby', 'icts-category-colour-label');
        list.hidden = true;

        function swatch(option) {
            var chip = document.createElement('span');
            chip.className = 'icts-category-colour-swatch';
            chip.setAttribute('aria-hidden', 'true');
            var fill = document.createElement('span');
            fill.style.backgroundColor = option.dataset.color || '';
            chip.appendChild(fill);
            return chip;
        }
        var items = options.map(function (option, index) {
            var item = document.createElement('div');
            item.id = id + '-option-' + index;
            item.className = 'icts-category-colour-option';
            item.setAttribute('role', 'option');
            item.title = option.dataset.color || '';
            item.appendChild(swatch(option));
            var label = document.createElement('span');
            label.textContent = option.textContent;
            item.appendChild(label);
            item.addEventListener('mousedown', function (event) { event.preventDefault(); });
            item.addEventListener('click', function () { active = index; commit(); button.focus(); });
            list.appendChild(item);
            return item;
        });

        function highlight() {
            items.forEach(function (item, index) {
                item.classList.toggle('is-active', index === active);
                item.setAttribute('aria-selected', String(index === select.selectedIndex));
            });
            if (!list.hidden) {
                button.setAttribute('aria-activedescendant', items[active].id);
                items[active].scrollIntoView({ block: 'nearest' });
            }
        }
        function sync() {
            active = Math.max(0, select.selectedIndex);
            button.replaceChildren(swatch(options[active]));
            var label = document.createElement('span');
            label.id = id + '-value';
            label.textContent = options[active].textContent;
            button.appendChild(label);
            button.title = options[active].dataset.color || '';
            highlight();
        }
        function close() {
            list.hidden = true;
            button.setAttribute('aria-expanded', 'false');
            button.removeAttribute('aria-activedescendant');
            search = '';
            clearTimeout(searchTimer);
        }
        function open() {
            active = Math.max(0, select.selectedIndex);
            var rect = button.getBoundingClientRect();
            var below = window.innerHeight - rect.bottom;
            var above = rect.top;
            var upwards = below < 240 && above > below;
            wrapper.classList.toggle('opens-above', upwards);
            list.style.maxHeight = Math.min(320, Math.max(100, (upwards ? above : below) - 12)) + 'px';
            list.hidden = false;
            button.setAttribute('aria-expanded', 'true');
            highlight();
        }
        function commit() {
            select.selectedIndex = active;
            close();
            select.dispatchEvent(new Event('change', { bubbles: true }));
        }
        button.addEventListener('click', function () { if (list.hidden) { open(); } else { close(); } });
        button.addEventListener('keydown', function (event) {
            var key = event.key;
            if (key === 'Tab') { if (!list.hidden) { commit(); } return; }
            if (key === 'Escape') { if (!list.hidden) { event.preventDefault(); close(); } return; }
            if (key === 'Enter' || key === ' ') {
                event.preventDefault();
                if (list.hidden) { open(); } else { commit(); }
                return;
            }
            if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) {
                event.preventDefault();
                if (list.hidden) { open(); }
                if (key === 'Home') { active = 0; }
                if (key === 'End') { active = options.length - 1; }
                if (key === 'ArrowDown') { active = Math.min(options.length - 1, active + 1); }
                if (key === 'ArrowUp') { active = Math.max(0, active - 1); }
                highlight();
            } else if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
                event.preventDefault();
                if (list.hidden) { open(); }
                search += key.toLocaleLowerCase();
                clearTimeout(searchTimer);
                searchTimer = setTimeout(function () { search = ''; }, 700);
                var match = options.findIndex(function (option) { return option.textContent.trim().toLocaleLowerCase().startsWith(search); });
                if (match !== -1) { active = match; highlight(); }
            }
        });
        document.addEventListener('click', function (event) { if (!wrapper.contains(event.target)) { close(); } });
        wrapper.addEventListener('focusout', function (event) { if (!wrapper.contains(event.relatedTarget)) { close(); } });
        select.addEventListener('change', sync);
        if (select.form) { select.form.addEventListener('reset', function () { close(); setTimeout(sync, 0); }); }
        select.id = id + '-native';
        select.hidden = true;
        select.before(wrapper);
        wrapper.append(button, list);
        sync();
    }

    document.querySelectorAll('.icts-category-colour-select').forEach(init);
})();
