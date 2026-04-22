import { escapeHtml } from '../../src/lib/dom.js';
import { SORT_OPTIONS, DEFAULT_SORT } from '../../src/lib/sort.js';

// Heroicons: check (inline so we don't have to round-trip the file system)
const CHECK_ICON = `
  <svg class="sort-menu-check w-4 h-4 text-[#108C89]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
`;

export class SortMenu {
  constructor(containerId, defaultSort = DEFAULT_SORT) {
    this.containerId = containerId;
    this.activeSort = defaultSort;
    this.onSortChange = null;
    this.open = false;
    this._documentClickHandler = null;
    this._listeners = [];
  }

  async load() {
    const container = document.getElementById(this.containerId);
    if (!container) return;
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}views/sort-menu/sort-menu.html`);
      if (!response.ok) {
        throw new Error(`Failed to load sort menu: ${response.status}`);
      }
      const html = await response.text();
      container.innerHTML = html;
      this._renderMenuItems();
      this._updateTriggerLabel();
      this._attachEventListeners();
    } catch (err) {
      console.error('SortMenu load error:', err);
    }
  }

  getActiveSort() {
    return this.activeSort;
  }

  _addListener(el, type, handler, options) {
    el.addEventListener(type, handler, options);
    this._listeners.push([el, type, handler, options]);
  }

  _renderMenuItems() {
    const list = document.getElementById('sort-menu-list');
    if (!list) return;
    list.innerHTML = SORT_OPTIONS.map(opt => `
      <button
        type="button"
        role="menuitemradio"
        aria-checked="${opt.key === this.activeSort}"
        data-sort="${escapeHtml(opt.key)}"
        class="sort-menu-item flex items-center justify-between gap-3 w-full px-3 py-2 text-sm text-left rounded-md text-[#343434] hover:bg-[#F1EDE5] transition-colors"
      >
        <span>${escapeHtml(opt.label)}</span>
        ${CHECK_ICON}
      </button>
    `).join('');
  }

  _updateTriggerLabel() {
    const label = document.getElementById('sort-menu-label');
    if (!label) return;
    const opt = SORT_OPTIONS.find(o => o.key === this.activeSort);
    if (opt) label.textContent = opt.label;
  }

  _attachEventListeners() {
    const btn = document.getElementById('sort-menu-btn');
    const panel = document.getElementById('sort-menu-panel');
    if (!btn || !panel) return;

    this._addListener(btn, 'click', (e) => {
      e.stopPropagation();
      this._setOpen(!this.open);
      if (this.open) {
        const first = panel.querySelector('[role="menuitemradio"][aria-checked="true"]')
          || panel.querySelector('[role="menuitemradio"]');
        if (first) setTimeout(() => first.focus(), 20);
      }
    });

    this._addListener(btn, 'keydown', (e) => {
      const openKeys = e.key === 'ArrowDown'
        || (!this.open && (e.key === 'Enter' || e.key === ' '));
      if (openKeys) {
        e.preventDefault();
        this._setOpen(true);
        const first = panel.querySelector('[role="menuitemradio"][aria-checked="true"]')
          || panel.querySelector('[role="menuitemradio"]');
        if (first) setTimeout(() => first.focus(), 20);
      }
      if (e.key === 'Escape' && this.open) {
        e.preventDefault();
        this._setOpen(false);
        btn.focus();
      }
    });

    this._addListener(panel, 'click', (e) => {
      e.stopPropagation();
      const item = e.target.closest('[data-sort]');
      if (!item) return;
      const key = item.dataset.sort;
      if (key && key !== this.activeSort) {
        this.activeSort = key;
        this._renderMenuItems();
        this._updateTriggerLabel();
        if (this.onSortChange) this.onSortChange(key);
      }
      this._setOpen(false);
      btn.focus();
    });

    this._addListener(panel, 'keydown', (e) => {
      const items = Array.from(panel.querySelectorAll('[role="menuitemradio"]'));
      if (items.length === 0) return;
      const idx = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        items[(idx + 1) % items.length].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        items[(idx - 1 + items.length) % items.length].focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        items[0].focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        items[items.length - 1].focus();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this._setOpen(false);
        btn.focus();
      } else if (e.key === 'Tab') {
        this._setOpen(false);
      }
    });

    this._documentClickHandler = () => {
      if (this.open) this._setOpen(false);
    };
    document.addEventListener('click', this._documentClickHandler);
  }

  _setOpen(isOpen) {
    this.open = isOpen;
    const btn = document.getElementById('sort-menu-btn');
    const panel = document.getElementById('sort-menu-panel');
    const caret = document.getElementById('sort-menu-caret');
    if (!btn || !panel) return;
    if (isOpen) {
      panel.classList.remove('hidden');
      // Next frame so the transition actually runs
      requestAnimationFrame(() => {
        panel.classList.remove('opacity-0', 'scale-95');
        panel.classList.add('opacity-100', 'scale-100');
      });
      if (caret) caret.classList.add('rotate-180');
      btn.setAttribute('aria-expanded', 'true');
    } else {
      panel.classList.add('opacity-0', 'scale-95');
      panel.classList.remove('opacity-100', 'scale-100');
      if (caret) caret.classList.remove('rotate-180');
      btn.setAttribute('aria-expanded', 'false');
      setTimeout(() => panel.classList.add('hidden'), 200);
    }
  }

  destroy() {
    if (this._documentClickHandler) {
      document.removeEventListener('click', this._documentClickHandler);
      this._documentClickHandler = null;
    }
    this._listeners.forEach(([el, type, handler, options]) => {
      el.removeEventListener(type, handler, options);
    });
    this._listeners = [];
  }
}
