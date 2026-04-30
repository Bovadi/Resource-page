const SVG = `class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"`;

const NAV_ITEMS = [
  {
    id: 'bip',
    label: 'BIP Builder',
    // Heroicons: squares-plus
    icon: `<svg ${SVG} aria-hidden="true"><path d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"/></svg>`,
  },
  {
    id: 'resources',
    label: 'Resource Library',
    // Heroicons: book-open
    icon: `<svg ${SVG} aria-hidden="true"><path d="M12 6.04168C10.4077 4.61656 8.30506 3.75 6 3.75C4.94809 3.75 3.93834 3.93046 3 4.26212V18.5121C3.93834 18.1805 4.94809 18 6 18C8.30506 18 10.4077 18.8666 12 20.2917M12 6.04168C13.5923 4.61656 15.6949 3.75 18 3.75C19.0519 3.75 20.0617 3.93046 21 4.26212V18.5121C20.0617 18.1805 19.0519 18 18 18C15.6949 18 13.5923 18.8666 12 20.2917M12 6.04168V20.2917"/></svg>`,
  },
  {
    id: 'courses',
    label: 'Course Library',
    // Custom: presentation screen with chart line
    icon: `<svg ${SVG} aria-hidden="true"><path d="M3.75 3V14.25C3.75 14.8467 3.98705 15.419 4.40901 15.841C4.83097 16.2629 5.40326 16.5 6 16.5H8.25M3.75 3H2.25M3.75 3H20.25M8.25 16.5H15.75M8.25 16.5L7.25 19.5M20.25 3H21.75M20.25 3V14.25C20.25 14.8467 20.0129 15.419 19.591 15.841C19.169 16.2629 18.5967 16.5 18 16.5H15.75M15.75 16.5L16.75 19.5M7.25 19.5H16.75M7.25 19.5L6.75 21M16.75 19.5L17.25 21"/><path d="M14 10L12 12"/><path d="M13 7L9 11"/></svg>`,
  },
  {
    id: 'strategies',
    label: 'Strategy Library',
    // Heroicons: briefcase
    icon: `<svg ${SVG} aria-hidden="true"><path d="M20.25 14.1499V18.4C20.25 19.4944 19.4631 20.4359 18.3782 20.58C16.2915 20.857 14.1624 21 12 21C9.83757 21 7.70854 20.857 5.62185 20.58C4.5369 20.4359 3.75 19.4944 3.75 18.4V14.1499M20.25 14.1499C20.7219 13.7476 21 13.1389 21 12.4889V8.70569C21 7.62475 20.2321 6.69082 19.1631 6.53086C18.0377 6.36247 16.8995 6.23315 15.75 6.14432M20.25 14.1499C20.0564 14.315 19.8302 14.4453 19.5771 14.5294C17.1953 15.3212 14.6477 15.75 12 15.75C9.35229 15.75 6.80469 15.3212 4.42289 14.5294C4.16984 14.4452 3.94361 14.3149 3.75 14.1499M3.75 14.1499C3.27808 13.7476 3 13.1389 3 12.4889V8.70569C3 7.62475 3.7679 6.69082 4.83694 6.53086C5.96233 6.36247 7.10049 6.23315 8.25 6.14432M15.75 6.14432V5.25C15.75 4.00736 14.7426 3 13.5 3H10.5C9.25736 3 8.25 4.00736 8.25 5.25V6.14432M15.75 6.14432C14.5126 6.0487 13.262 6 12 6C10.738 6 9.48744 6.0487 8.25 6.14432M12 12.75H12.0075V12.7575H12V12.75Z"/></svg>`,
  },
  {
    id: 'rbt',
    label: 'RBT 40-Hour Course',
    // Heroicons: academic-cap
    icon: `<svg ${SVG} aria-hidden="true"><path d="M4.25933 10.1466C3.98688 12.2307 3.82139 14.3483 3.76853 16.494C6.66451 17.703 9.41893 19.1835 12 20.9036C14.5811 19.1835 17.3355 17.703 20.2315 16.494C20.1786 14.3484 20.0131 12.2307 19.7407 10.1467M4.25933 10.1466C3.38362 9.8523 2.49729 9.58107 1.60107 9.3337C4.84646 7.05887 8.32741 5.0972 12 3.49255C15.6727 5.0972 19.1536 7.05888 22.399 9.33371C21.5028 9.58109 20.6164 9.85233 19.7407 10.1467M4.25933 10.1466C6.94656 11.0499 9.5338 12.1709 12.0001 13.4886C14.4663 12.1709 17.0535 11.0499 19.7407 10.1467M6.75 15C7.16421 15 7.5 14.6642 7.5 14.25C7.5 13.8358 7.16421 13.5 6.75 13.5C6.33579 13.5 6 13.8358 6 14.25C6 14.6642 6.33579 15 6.75 15ZM6.75 15V11.3245C8.44147 10.2735 10.1936 9.31094 12 8.44329M4.99264 19.9926C6.16421 18.8211 6.75 17.2855 6.75 15.75V14.25"/></svg>`,
  },
  {
    id: 'bcba',
    label: 'BCBA Curriculum',
    // Heroicons: check-badge
    icon: `<svg ${SVG} aria-hidden="true"><path d="M9 12.75L11.25 15L15 9.75M21 12C21 13.2683 20.3704 14.3895 19.4067 15.0682C19.6081 16.2294 19.2604 17.4672 18.3637 18.3639C17.467 19.2606 16.2292 19.6083 15.068 19.4069C14.3893 20.3705 13.2682 21 12 21C10.7319 21 9.61072 20.3705 8.93204 19.407C7.77066 19.6086 6.53256 19.261 5.6357 18.3641C4.73886 17.4673 4.39125 16.2292 4.59286 15.0678C3.62941 14.3891 3 13.2681 3 12C3 10.7319 3.62946 9.61077 4.59298 8.93208C4.39147 7.77079 4.7391 6.53284 5.63587 5.63607C6.53265 4.73929 7.77063 4.39166 8.93194 4.59319C9.61061 3.62955 10.7318 3 12 3C13.2682 3 14.3893 3.6295 15.068 4.59307C16.2294 4.39145 17.4674 4.73906 18.3643 5.6359C19.2611 6.53274 19.6087 7.77081 19.4071 8.93218C20.3706 9.61087 21 10.7319 21 12Z"/></svg>`,
  },
];

export class NavRail {
  constructor(containerId, defaultTab = 'bip') {
    this.containerId = containerId;
    this.activeTab = defaultTab;
    this.onTabSwitch = null;
    this._listeners = [];
  }

  _addListener(el, type, handler, options) {
    el.addEventListener(type, handler, options);
    this._listeners.push([el, type, handler, options]);
  }

  async load() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    try {
      const response = await fetch(`${import.meta.env.BASE_URL}views/nav-rail/nav-rail.html`);
      if (!response.ok) throw new Error(`Failed to load nav rail: ${response.status}`);
      const html = await response.text();
      container.innerHTML = html;
      this._renderItems();
      this._setActiveTab(this.activeTab);
      this._attachEventListeners();
    } catch (err) {
      console.error('NavRail load error:', err);
    }
  }

  _renderItems() {
    const container = document.getElementById('nav-rail-items');
    if (!container) return;

    container.innerHTML = NAV_ITEMS.map(item => `
      <button
        class="nav-rail-item flex items-center p-2.5 rounded-lg text-sm font-medium text-[#8A857D] hover:bg-[#F1EDE5] hover:text-[#343434] transition-colors"
        data-tab="${item.id}"
        aria-label="${item.label}"
      >
        ${item.icon}
        <span class="nav-label whitespace-nowrap">${item.label}</span>
      </button>
    `).join('');
  }

  _setActiveTab(tabId) {
    this.activeTab = tabId;
    document.querySelectorAll('#nav-rail-items .nav-rail-item').forEach(item => {
      const isActive = item.dataset.tab === tabId;
      item.classList.toggle('bg-[#F1EDE5]', isActive);
      item.classList.toggle('text-[#343434]', isActive);
      item.classList.toggle('text-[#8A857D]', !isActive);
    });
  }

  _attachEventListeners() {
    const rail = document.getElementById('nav-rail');
    if (!rail) return;

    this._addListener(rail, 'mouseenter', () => {
      rail.classList.add('is-expanded');
    });
    this._addListener(rail, 'mouseleave', () => {
      rail.classList.remove('is-expanded');
    });

    const itemsContainer = document.getElementById('nav-rail-items');
    if (itemsContainer) {
      this._addListener(itemsContainer, 'click', (e) => {
        const btn = e.target.closest('[data-tab]');
        if (!btn) return;
        const tabId = btn.dataset.tab;
        if (tabId && tabId !== this.activeTab) {
          this._setActiveTab(tabId);
          if (this.onTabSwitch) this.onTabSwitch(tabId);
        }
      });
    }

    // Settings panel hover — expands upward on mouseenter
    const settingsWrapper = document.getElementById('settings-wrapper');
    if (settingsWrapper) {
      this._addListener(settingsWrapper, 'mouseenter', () => {
        settingsWrapper.classList.add('settings-open');
      });
      this._addListener(settingsWrapper, 'mouseleave', () => {
        settingsWrapper.classList.remove('settings-open');
      });
    }
  }

  setActiveTab(tabId) {
    this._setActiveTab(tabId);
  }

  destroy() {
    this._listeners.forEach(([el, type, handler, options]) => {
      el.removeEventListener(type, handler, options);
    });
    this._listeners = [];
  }
}
