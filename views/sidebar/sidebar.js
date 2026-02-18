import { SIDEBAR_CONFIG } from '../../src/config/sidebarConfig.js';

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
      const filters = SIDEBAR_CONFIG[tab].filters;
      if (!Array.isArray(filters)) return;
      filters.forEach(f => {
        if (!f.isShowAll) {
          this.filterStates[tab][f.id] = false;
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

    const safeFilters = Array.isArray(filters) ? filters : [];
    const tabFilterStates = this.filterStates[tabKey] || {};
    const showAllFilter = safeFilters.find(f => f.isShowAll);
    const childFilters = safeFilters.filter(f => !f.isShowAll);
    const hasShowAll = !!showAllFilter;

    const allChildrenChecked = childFilters.length > 0 && childFilters.every(f => tabFilterStates[f.id]);

    const showAllHTML = hasShowAll ? `
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
        } else {
          this.filterStates[this.activeTab][filterId] = checkbox.checked;
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
