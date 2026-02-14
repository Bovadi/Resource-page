export class Sidebar {
  constructor(containerId) {
    this.containerId = containerId;
    this.isOpen = false;
    this.onActionClick = null;
    this.filters = {
      madeByYou: false,
      sharedWithYou: false
    };
    this.onFilterChange = null;
  }

  async load() {
    const response = await fetch('/views/sidebar/sidebar.html');
    const html = await response.text();
    const container = document.getElementById(this.containerId);
    if (container) {
      container.innerHTML = html;
      this.renderActions();
      this.renderFilters();
      this.attachEventListeners();
    }
  }

  renderActions() {
    const actionsContainer = document.getElementById('sidebar-actions');
    if (!actionsContainer) return;

    const actionsHTML = `
      <button data-action="generate-bip" class="w-full flex items-center gap-3 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 active:scale-[0.98] min-h-[48px] bg-[#108C89] text-white hover:bg-[#0d7673] shadow-sm">
        <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 4V2"/>
          <path d="M15 16v-2"/>
          <path d="M8 9h2"/>
          <path d="M20 9h2"/>
          <path d="M17.8 11.8L19 13"/>
          <path d="M15 9h.01"/>
          <path d="M17.8 6.2L19 5"/>
          <path d="M3 21l9-9"/>
          <path d="M12.2 6.2L11 5"/>
        </svg>
        <span class="text-left">Generate BIP</span>
      </button>
      <button data-action="create-bip-new" class="w-full flex items-center gap-3 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 active:scale-[0.98] bg-white text-[#108C89] shadow-[inset_0_0_0_2px_#108C89] hover:bg-[#108C89]/5">
        <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        <div class="flex flex-row items-center gap-2">
          <span class="text-left">Create BIP</span>
          <span class="text-[8px] font-semibold uppercase tracking-wide text-[#108C89] bg-[#CFE8E7] px-1.5 py-0.5 rounded-full">New</span>
        </div>
      </button>
      <button data-action="create-bip-legacy" class="w-full flex items-center gap-3 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 active:scale-[0.98] bg-white text-[#108C89] shadow-[inset_0_0_0_2px_#108C89] hover:bg-[#108C89]/5">
        <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        <div class="flex flex-row items-center gap-2">
          <span class="text-left">Create BIP</span>
          <span class="text-[8px] font-semibold uppercase tracking-wide text-[#108C89] bg-[#CFE8E7] px-1.5 py-0.5 rounded-full">Legacy</span>
        </div>
      </button>
    `;

    actionsContainer.innerHTML = actionsHTML;
  }

  renderFilters() {
    const filtersContainer = document.getElementById('sidebar-filters');
    if (!filtersContainer) return;

    const checkboxBaseClass = "w-5 h-5 rounded border-2 border-gray-300 bg-white transition-all duration-200 flex items-center justify-center flex-shrink-0 cursor-pointer";
    const checkboxCheckedClass = "bg-[#343434] border-[#343434]";
    const labelClass = "flex items-center gap-3 w-full py-3 px-4 rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200 select-none";

    const filtersHTML = `
      <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">Filter BIPs</h3>
      <div class="space-y-1">
        <label class="${labelClass}">
          <div class="${checkboxBaseClass} ${this.filters.madeByYou ? checkboxCheckedClass : ''}" data-filter="madeByYou">
            ${this.filters.madeByYou ? `
              <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ` : ''}
          </div>
          <span class="text-sm text-[#343434] font-medium">Made by You</span>
        </label>
        <label class="${labelClass}">
          <div class="${checkboxBaseClass} ${this.filters.sharedWithYou ? checkboxCheckedClass : ''}" data-filter="sharedWithYou">
            ${this.filters.sharedWithYou ? `
              <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ` : ''}
          </div>
          <span class="text-sm text-[#343434] font-medium">Shared with You</span>
        </label>
      </div>
    `;

    filtersContainer.innerHTML = filtersHTML;
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
      filtersContainer.addEventListener('click', (e) => {
        const checkbox = e.target.closest('[data-filter]');
        if (!checkbox) return;

        const filterName = checkbox.dataset.filter;
        if (filterName) {
          this.filters[filterName] = !this.filters[filterName];
          this.renderFilters();
          if (this.onFilterChange) {
            this.onFilterChange({ ...this.filters });
          }
        }
      });
    }

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
