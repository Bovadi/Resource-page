import { SIDEBAR_CONFIG } from '../../src/config/sidebarConfig.js';

export class Sidebar {
  constructor(containerId) {
    this.containerId = containerId;
    this.isOpen = false;
    this.onActionClick = null;
    this.onFilterChange = null;
    this.activeTab = 'resources';
    this.filterStates = {};
  }

  async load() {
    const response = await fetch('/views/sidebar/sidebar.html');
    const html = await response.text();
    const container = document.getElementById(this.containerId);
    if (container) {
      container.innerHTML = html;
      this._initFilterStates();
      this.renderForTab(this.activeTab);
      this.attachEventListeners();
    }
  }

  _initFilterStates() {
    Object.keys(SIDEBAR_CONFIG).forEach(tab => {
      this.filterStates[tab] = {};
      SIDEBAR_CONFIG[tab].filters.forEach(f => {
        this.filterStates[tab][f.id] = false;
      });
    });
  }

  switchTab(tabKey) {
    if (!SIDEBAR_CONFIG[tabKey]) return;
    this.activeTab = tabKey;
    this.renderForTab(tabKey);
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

  _renderActions(actions) {
    const actionsContainer = document.getElementById('sidebar-actions');
    if (!actionsContainer) return;

    actionsContainer.innerHTML = actions.map(action => {
      const badgeHTML = action.badge
        ? `<span class="text-[8px] font-semibold uppercase tracking-wide text-[#108C89] bg-[#E7F3F3] px-1.5 py-0.5 rounded-full">${action.badge.text}</span>`
        : '';

      const labelHTML = action.badge
        ? `<div class="flex flex-row items-center gap-2"><span class="text-left">${action.label}</span>${badgeHTML}</div>`
        : `<span class="text-left">${action.label}</span>`;

      const variantClasses = action.variant === 'primary'
        ? 'bg-[#108C89] text-white hover:bg-[#0d7673] shadow-sm'
        : 'bg-white text-[#108C89] shadow-[inset_0_0_0_1px_#108C89] hover:bg-[#108C89]/5';

      return `
        <button data-action="${action.id}" class="w-full flex items-center gap-3 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 active:scale-[0.98] min-h-[48px] ${variantClasses}">
          ${action.icon}
          ${labelHTML}
        </button>
      `;
    }).join('');
  }

  _renderFilters(filters, title, tabKey) {
    const filtersContainer = document.getElementById('sidebar-filters');
    if (!filtersContainer) return;

    const tabFilterStates = this.filterStates[tabKey] || {};

    const checkboxesHTML = filters.map(filter => {
      const isChecked = tabFilterStates[filter.id] || false;
      return `
        <label class="cb-row">
          <input
            type="checkbox"
            id="filter-${filter.id}"
            ${isChecked ? 'checked' : ''}
            class="cb-input"
            data-filter="${filter.id}"
          />
          <span class="cb-box"></span>
          <span class="cb-label">${filter.label}</span>
        </label>
      `;
    }).join('');

    filtersContainer.innerHTML = `
      <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-4">${title}</h3>
      <div class="space-y-1">${checkboxesHTML}</div>
    `;
  }

  attachEventListeners() {
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
        if (filterId) {
          if (!this.filterStates[this.activeTab]) {
            this.filterStates[this.activeTab] = {};
          }
          this.filterStates[this.activeTab][filterId] = checkbox.checked;
          if (this.onFilterChange) {
            this.onFilterChange({ ...this.filterStates[this.activeTab] });
          }
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
      } else {
        sidebar.classList.add('-translate-x-full');
      }
    }
  }

  close() {
    this.isOpen = false;
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.add('-translate-x-full');
    }
  }
}
