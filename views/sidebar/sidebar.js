import { SIDEBAR_CONFIG } from '../../src/config/sidebarConfig.js';

const ACTION_TOOLTIPS = {
  'generate-bip': 'Auto-generate a behavior plan',
  'create-bip-new': 'Start a new behavior plan',
  'create-bip-legacy': 'Use the classic BIP editor',
};

function escapeHtml(value) {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export class Sidebar {
  constructor(containerId) {
    this.containerId = containerId;
    this.isOpen = false;
    this.onActionClick = null;
    this.onFilterChange = null;
    this.onTabSwitch = null;
    this.activeTab = 'bip';
    this.filterStates = {};
    this._focusTrapHandler = null;
    this._escapeHandler = null;
  }

  async load() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    try {
      const response = await fetch('/views/sidebar/sidebar.html');
      if (!response.ok) {
        throw new Error(`Failed to load sidebar: ${response.status}`);
      }
      const html = await response.text();
      container.innerHTML = html;
      this._initFilterStates();
      this.renderForTab(this.activeTab);
      this.attachEventListeners();
    } catch (err) {
      console.error('Sidebar load error:', err);
      container.innerHTML = '<p class="p-4 text-sm text-red-600">Failed to load sidebar.</p>';
    }
  }

  _initFilterStates() {
    Object.keys(SIDEBAR_CONFIG).forEach(tab => {
      this.filterStates[tab] = {};
      const filters = SIDEBAR_CONFIG[tab].filters;
      if (!Array.isArray(filters)) return;
      filters.forEach(f => {
        if (!f.isShowAll) {
          this.filterStates[tab][f.id] = true;
        }
      });
    });
  }

  switchTab(tabKey) {
    if (!SIDEBAR_CONFIG[tabKey]) return;
    this.activeTab = tabKey;
    this.renderForTab(tabKey);
    this._updateSidebarTabNav(tabKey);
  }

  renderForTab(tabKey) {
    const config = SIDEBAR_CONFIG[tabKey];
    if (!config) return;

    const hideActions = ['resources', 'courses', 'strategies'].includes(tabKey);
    const actionsEl = document.getElementById('sidebar-actions');
    const dividerEl = actionsEl && actionsEl.nextElementSibling;

    if (actionsEl) actionsEl.style.display = hideActions ? 'none' : '';
    if (dividerEl && dividerEl.classList.contains('my-5')) {
      dividerEl.style.display = hideActions ? 'none' : '';
    }

    if (!hideActions) {
      this._renderActions(config.actions);
    }
    this._renderFilters(config.filters, config.filtersTitle, tabKey);
  }

  _updateSidebarTabNav(tabKey) {
    const buttons = document.querySelectorAll('.sidebar-nav-tab');
    buttons.forEach(btn => {
      if (btn.dataset.tab === tabKey) {
        btn.classList.add('bg-[#F1EDE5]', 'text-[#343434]');
        btn.classList.remove('text-[#918979]', 'hover:bg-gray-100');
      } else {
        btn.classList.remove('bg-[#F1EDE5]', 'text-[#343434]');
        btn.classList.add('text-[#918979]', 'hover:bg-gray-100');
      }
    });
  }

  _renderActions(actions) {
    const actionsContainer = document.getElementById('sidebar-actions');
    if (!actionsContainer) return;

    this._cleanupTooltips();

    actionsContainer.innerHTML = actions.map(action => {
      const badgeHTML = action.badge
        ? `<span class="text-[8px] font-semibold uppercase tracking-wide text-[#108C89] bg-[#E7F3F3] px-1.5 py-0.5 rounded-full">${escapeHtml(action.badge.text)}</span>`
        : '';

      const labelHTML = action.badge
        ? `<div class="flex flex-row items-center gap-2"><span class="text-left">${escapeHtml(action.label)}</span>${badgeHTML}</div>`
        : `<span class="text-left">${escapeHtml(action.label)}</span>`;

      const variantClasses = action.variant === 'primary'
        ? 'bg-[#108C89] text-white hover:bg-[#0d7673] shadow-sm'
        : 'bg-white text-[#108C89] shadow-[inset_0_0_0_1px_#108C89] hover:bg-[#108C89]/5';

      const tooltipText = ACTION_TOOLTIPS[action.id];
      const ariaLabel = tooltipText ? ` aria-label="${escapeHtml(tooltipText)}"` : '';

      return `
        <button data-action="${action.id}"${ariaLabel} class="w-full flex items-center gap-3 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 active:scale-[0.98] min-h-[48px] ${variantClasses}">
          ${action.icon}
          ${labelHTML}
        </button>
      `;
    }).join('');

    this._attachTooltipListeners(actionsContainer, actions);
  }

  _cleanupTooltips() {
    if (this._activeTooltips) {
      this._activeTooltips.forEach(({ tip, cleanup }) => {
        cleanup();
        if (tip.parentNode) tip.parentNode.removeChild(tip);
      });
    }
    this._activeTooltips = [];
  }

  _createTooltipEl(text) {
    const tip = document.createElement('div');
    tip.className = 'sidebar-tooltip';
    tip.setAttribute('role', 'tooltip');
    tip.setAttribute('aria-hidden', 'true');
    tip.innerHTML = `<div class="sidebar-tooltip-arrow"></div><div class="sidebar-tooltip-inner">${escapeHtml(text)}</div>`;
    document.body.appendChild(tip);
    return tip;
  }

  _positionTooltip(btn, tip) {
    const rect = btn.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();
    const gap = 12;
    tip.style.left = `${rect.right + gap}px`;
    tip.style.top = `${rect.top + rect.height / 2 - tipRect.height / 2}px`;
  }

  _attachTooltipListeners(container, actions) {
    actions.forEach(action => {
      const tooltipText = ACTION_TOOLTIPS[action.id];
      if (!tooltipText) return;

      const btn = container.querySelector(`[data-action="${action.id}"]`);
      if (!btn) return;

      const tip = this._createTooltipEl(tooltipText);
      let longPressTimer = null;

      const show = () => {
        this._positionTooltip(btn, tip);
        tip.classList.add('is-visible');
        tip.setAttribute('aria-hidden', 'false');
      };

      const hide = () => {
        tip.classList.remove('is-visible');
        tip.setAttribute('aria-hidden', 'true');
      };

      const onMouseEnter = () => show();
      const onMouseLeave = () => hide();
      const onFocus = () => show();
      const onBlur = () => hide();

      const onTouchStart = (e) => {
        longPressTimer = setTimeout(() => {
          e.preventDefault();
          show();
          setTimeout(hide, 2000);
        }, 500);
      };

      const onTouchEnd = () => {
        if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
      };

      const onTouchCancel = () => {
        if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
        hide();
      };

      btn.addEventListener('mouseenter', onMouseEnter);
      btn.addEventListener('mouseleave', onMouseLeave);
      btn.addEventListener('focus', onFocus);
      btn.addEventListener('blur', onBlur);
      btn.addEventListener('touchstart', onTouchStart, { passive: false });
      btn.addEventListener('touchend', onTouchEnd);
      btn.addEventListener('touchcancel', onTouchCancel);

      const cleanup = () => {
        btn.removeEventListener('mouseenter', onMouseEnter);
        btn.removeEventListener('mouseleave', onMouseLeave);
        btn.removeEventListener('focus', onFocus);
        btn.removeEventListener('blur', onBlur);
        btn.removeEventListener('touchstart', onTouchStart);
        btn.removeEventListener('touchend', onTouchEnd);
        btn.removeEventListener('touchcancel', onTouchCancel);
      };

      this._activeTooltips.push({ tip, cleanup });
    });
  }

  _renderFilters(filters, title, tabKey) {
    const filtersContainer = document.getElementById('sidebar-filters');
    if (!filtersContainer) return;

    const safeFilters = Array.isArray(filters) ? filters : [];
    const tabFilterStates = this.filterStates[tabKey] || {};
    const showAllFilter = safeFilters.find(f => f.isShowAll);
    const childFilters = safeFilters.filter(f => !f.isShowAll);
    const hasShowAll = !!showAllFilter;

    const allChildrenChecked = childFilters.length > 0 && childFilters.every(f => tabFilterStates[f.id]);

    const showAllHTML = hasShowAll ? `
      <div class="cb-show-all-sticky">
        <label class="cb-row cb-row--show-all">
          <input
            type="checkbox"
            id="filter-${showAllFilter.id}"
            ${allChildrenChecked ? 'checked' : ''}
            class="cb-input"
            data-filter="${showAllFilter.id}"
            data-cb-parent
          />
          <span class="cb-box"></span>
          <span class="cb-label cb-label--show-all">${escapeHtml(showAllFilter.label)}</span>
        </label>
        <div class="cb-show-all-divider"></div>
      </div>
    ` : '';

    const grouped = childFilters.reduce((acc, filter) => {
      const key = filter.group || '';
      if (!acc[key]) acc[key] = [];
      acc[key].push(filter);
      return acc;
    }, {});

    const childCheckboxesHTML = Object.entries(grouped).map(([groupName, groupFilters]) => {
      const headerHTML = groupName
        ? `<div class="cb-group-header">${escapeHtml(groupName)}</div>`
        : '';
      const checkboxes = groupFilters.map(filter => {
        const isChecked = tabFilterStates[filter.id] || false;
        return `
          <label class="cb-row">
            <input
              type="checkbox"
              id="filter-${filter.id}"
              ${isChecked ? 'checked' : ''}
              class="cb-input"
              data-filter="${filter.id}"
              ${hasShowAll ? 'data-cb-child' : ''}
            />
            <span class="cb-box"></span>
            <span class="cb-label">${escapeHtml(filter.label)}</span>
          </label>
        `;
      }).join('');
      return `<div class="cb-group">${headerHTML}${checkboxes}</div>`;
    }).join('');

    const groupAttr = hasShowAll ? 'data-cb-group' : '';

    filtersContainer.innerHTML = `
      <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-4">${escapeHtml(title)}</h3>
      <div class="space-y-1" ${groupAttr}>
        ${showAllHTML}
        ${childCheckboxesHTML}
      </div>
    `;

    this._syncParentCheckbox();
  }

  _syncParentCheckbox() {
    const filtersContainer = document.getElementById('sidebar-filters');
    if (!filtersContainer) return;

    const group = filtersContainer.querySelector('[data-cb-group]');
    if (!group) return;

    const parent = group.querySelector('.cb-input[data-cb-parent]');
    if (!parent) return;

    const children = Array.from(group.querySelectorAll('.cb-input[data-cb-child]'));
    if (children.length === 0) return;

    const checkedCount = children.filter(c => c.checked).length;
    if (checkedCount === 0) {
      parent.checked = false;
      parent.indeterminate = false;
    } else if (checkedCount === children.length) {
      parent.checked = true;
      parent.indeterminate = false;
    } else {
      parent.checked = false;
      parent.indeterminate = true;
    }
  }

  attachEventListeners() {
    const tabNav = document.getElementById('sidebar-tab-nav');
    if (tabNav) {
      tabNav.addEventListener('click', (e) => {
        const btn = e.target.closest('.sidebar-nav-tab');
        if (!btn) return;
        const tabKey = btn.dataset.tab;
        if (tabKey && tabKey !== this.activeTab) {
          this.switchTab(tabKey);
          if (this.onTabSwitch) {
            this.onTabSwitch(tabKey);
          }
        }
      });
    }
    this._updateSidebarTabNav(this.activeTab);

    const actionsContainer = document.getElementById('sidebar-actions');
    if (actionsContainer) {
      actionsContainer.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;
        const action = button.dataset.action;
        if (action && this.onActionClick) {
          this.onActionClick(action);
        }
      });
    }

    const filtersContainer = document.getElementById('sidebar-filters');
    if (filtersContainer) {
      filtersContainer.addEventListener('change', (e) => {
        const checkbox = e.target.closest('input[data-filter]');
        if (!checkbox) return;
        const filterId = checkbox.dataset.filter;
        if (!filterId) return;

        if (!this.filterStates[this.activeTab]) {
          this.filterStates[this.activeTab] = {};
        }

        const config = SIDEBAR_CONFIG[this.activeTab];
        const configFilters = config && Array.isArray(config.filters) ? config.filters : [];
        const isShowAll = configFilters.find(f => f.id === filterId && f.isShowAll);

        if (isShowAll) {
          const childFilters = configFilters.filter(f => !f.isShowAll);
          childFilters.forEach(f => {
            this.filterStates[this.activeTab][f.id] = checkbox.checked;
          });

          const group = filtersContainer.querySelector('[data-cb-group]');
          if (group) {
            group.querySelectorAll('.cb-input[data-cb-child]').forEach(c => {
              c.checked = checkbox.checked;
            });
          }

          checkbox.indeterminate = false;
        } else {
          this.filterStates[this.activeTab][filterId] = checkbox.checked;
          this._syncParentCheckbox();
        }

        if (this.onFilterChange) {
          this.onFilterChange({ ...this.filterStates[this.activeTab] });
        }
      });
    }
  }

  getFilters() {
    return { ...(this.filterStates[this.activeTab] || {}) };
  }

  toggle() {
    this.isOpen = !this.isOpen;
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      if (this.isOpen) {
        sidebar.classList.remove('-translate-x-full');
        this._enableFocusTrap();
        this._lockBodyScroll(true);
      } else {
        sidebar.classList.add('-translate-x-full');
        this._disableFocusTrap();
        this._lockBodyScroll(false);
      }
    }
  }

  close() {
    this.isOpen = false;
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.add('-translate-x-full');
    }
    this._disableFocusTrap();
    this._lockBodyScroll(false);
  }

  _lockBodyScroll(lock) {
    if (window.innerWidth >= 1024) return;
    if (lock) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  _enableFocusTrap() {
    if (window.innerWidth >= 1024) return;

    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    this._focusTrapHandler = (e) => {
      if (e.key !== 'Tab') return;

      const focusableElements = sidebar.querySelectorAll(focusableSelectors);
      const focusable = Array.from(focusableElements).filter(el => !el.disabled && el.offsetParent !== null);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    this._escapeHandler = (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
        if (this.onClose) this.onClose();
      }
    };

    document.addEventListener('keydown', this._focusTrapHandler);
    document.addEventListener('keydown', this._escapeHandler);

    const firstFocusable = sidebar.querySelector(focusableSelectors);
    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 100);
    }
  }

  _disableFocusTrap() {
    if (this._focusTrapHandler) {
      document.removeEventListener('keydown', this._focusTrapHandler);
      this._focusTrapHandler = null;
    }
    if (this._escapeHandler) {
      document.removeEventListener('keydown', this._escapeHandler);
      this._escapeHandler = null;
    }
  }
}
