import { NavRail } from './views/nav-rail/nav-rail.js';
import { Header } from './views/header/header.js';
import { CardGrid } from './views/card-grid/card-grid.js';
import { SortMenu } from './views/sort-menu/sort-menu.js';
import { SAMPLE_CARDS } from './src/data/demoData.js';
import { sortCards, DEFAULT_SORT } from './src/lib/sort.js';

class App {
  constructor() {
    this.state = { activeTab: 'bip', isSidebarOpen: false };

    this.allCards = SAMPLE_CARDS;
    this._filterGeneration = 0;
    this._retryCount = 0;
    this._maxRetries = 3;

    this.navRail = new NavRail('nav-rail-container', 'bip');
    this.header = new Header('header-container');
    this.cardGrid = new CardGrid('main-container');
    this.sortMenu = new SortMenu('toolbar-container', DEFAULT_SORT);
    this.activeSort = DEFAULT_SORT;

    this.sidebar = null;
    this._sidebarReady = null;

    this.modal = null;
    this._modalReady = null;

    this.init();
    window.addEventListener('beforeunload', () => this.destroy());
  }

  destroy() {
    this.navRail.destroy();
    this.header.destroy();
    if (this.sidebar) this.sidebar.destroy();
    this.cardGrid.destroy();
    this.sortMenu.destroy();
    if (this.modal) this.modal.destroy();
  }

  async init() {
    try {
      await Promise.all([
        this.navRail.load(),
        this.header.load(),
        this.cardGrid.load(),
        this.sortMenu.load(),
        this._loadSidebar(),
      ]);
      this.setupEventHandlers();
      this.filterAndDisplayCards();
    } catch (err) {
      console.error('App failed to initialize:', err);
      const root = document.getElementById('main-container');
      if (root) {
        root.innerHTML = '<p class="text-center text-red-600 p-8">Failed to load the application. Please refresh the page.</p>';
      }
    }
  }

  async _loadSidebar() {
    if (this._sidebarReady) return this._sidebarReady;
    this._sidebarReady = (async () => {
      const { Sidebar } = await import('./views/sidebar/sidebar.js');
      this.sidebar = new Sidebar('sidebar-container');
      await this.sidebar.load();
    })().catch((err) => {
      this._sidebarReady = null;
      throw err;
    });
    return this._sidebarReady;
  }

  async _loadModal() {
    if (this._modalReady) return this._modalReady;
    this._modalReady = (async () => {
      const { Modal } = await import('./views/modal/modal.js');
      this.modal = new Modal('modal-container');
      await this.modal.load();
    })().catch((err) => {
      this._modalReady = null;
      throw err;
    });
    return this._modalReady;
  }

  setupEventHandlers() {
    // Desktop nav rail
    this.navRail.onTabSwitch = (tabKey) => {
      this.switchTab(tabKey);
    };

    // Mobile header hamburger
    this.header.onHamburgerClick = async () => {
      await this._loadSidebar();
      this.toggleSidebar();
    };

    // Sidebar overlay tap to close
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', () => this.toggleSidebar());
    }

    if (this.sidebar) {
      this.sidebar.onTabSwitch = (tabKey) => {
        this.switchTab(tabKey);
        if (this.state.isSidebarOpen) this.toggleSidebar();
      };
      this.sidebar.onFilterChange = () => {
        this.filterAndDisplayCards();
      };
      this.sidebar.onActionClick = (action) => {
        console.log('Action clicked:', action);
      };
      this.sidebar.onClose = () => {
        this.state.isSidebarOpen = false;
        this.header.updateHamburgerIcon(false);
        this.updateSidebarOverlay();
      };
    }

    this.cardGrid.onCardClick = async (card) => {
      try {
        await this._loadModal();
        if (this.modal) this.modal.open(card);
      } catch (err) {
        console.error('Failed to open modal:', err);
      }
    };

    this.sortMenu.onSortChange = (sortKey) => {
      this.activeSort = sortKey;
      this.filterAndDisplayCards();
    };

    this.cardGrid.onRetry = () => {
      if (this._retryCount >= this._maxRetries) {
        this.cardGrid.setError('Unable to load content after several attempts. Please refresh the page.');
        return;
      }
      this._retryCount++;
      this.filterAndDisplayCards();
    };

    // Search input → Gleap AI chatbar (Kai)
    // Pre-populates Kai with the typed query via Gleap.askAI(question).
    // Docs: https://docs.gleap.io/documentation/javascript/aichatbar
    // Per project conventions, Gleap is assumed already initialized at app
    // start — we only call into the existing SDK, never re-init it.
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        const query = searchInput.value.trim();
        if (!query) return;
        if (window.Gleap && typeof window.Gleap.askAI === 'function') {
          window.Gleap.askAI(query);
          // Clear so the next query starts fresh
          searchInput.value = '';
        } else {
          console.warn('[search] Gleap SDK not detected on window. Query was:', query);
        }
      });
    }
  }

  toggleSidebar() {
    this.state.isSidebarOpen = !this.state.isSidebarOpen;
    if (this.sidebar) this.sidebar.toggle();
    this.header.updateHamburgerIcon(this.state.isSidebarOpen);
    this.updateSidebarOverlay();
  }

  updateSidebarOverlay() {
    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) {
      overlay.classList.toggle('hidden', !this.state.isSidebarOpen);
    }
  }

  switchTab(tabKey) {
    this.state.activeTab = tabKey;
    this.navRail.setActiveTab(tabKey);
    if (this.sidebar) this.sidebar.switchTab(tabKey);
    this.filterAndDisplayCards(true);
  }

  getCardType() {
    const typeMap = { courses: 'course', bip: 'bip' };
    return typeMap[this.state.activeTab] || 'resource';
  }

  filterAndDisplayCards(showSpinner = false) {
    this._filterGeneration++;
    const generation = this._filterGeneration;

    this.cardGrid.setError(null);

    const applyFilter = () => {
      try {
        const filters = this.sidebar ? this.sidebar.getFilters() : {};
        let filtered = this.allCards.filter(card => card.type === this.getCardType());

        const activeFilters = Object.entries(filters).filter(([, val]) => val).map(([key]) => key);
        const hasFilterSystem = Object.keys(filters).length > 0;

        if (hasFilterSystem && activeFilters.length === 0) {
          filtered = [];
        } else if (activeFilters.length > 0) {
          filtered = filtered.filter(card =>
            activeFilters.some(key => card[key] === true)
          );
        }

        if (generation !== this._filterGeneration) return;
        this._retryCount = 0;
        const sorted = sortCards(filtered, this.activeSort);
        this.cardGrid.setCards(sorted);

      } catch (err) {
        console.error('Filter error:', err);
        this.cardGrid.setError('Failed to load content');
      }
    };

    if (showSpinner) {
      this.cardGrid.setLoading(true);
      setTimeout(applyFilter, 250);
    } else {
      applyFilter();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});
