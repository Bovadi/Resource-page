import { Header } from './views/header/header.js';
import { CardGrid } from './views/card-grid/card-grid.js';
import { SAMPLE_CARDS } from './src/data/demoData.js';

class App {
  constructor() {
    this.state = {
      activeTab: 'bip',
      isSidebarOpen: false,
    };

    this.allCards = SAMPLE_CARDS;
    this._filterGeneration = 0;
    this._retryCount = 0;
    this._maxRetries = 3;

    this.header = new Header('header-container', 'bip');
    this.cardGrid = new CardGrid('main-container');

    this.sidebar = null;
    this._sidebarReady = null;

    this.modal = null;
    this._modalReady = null;

    this.init();
    window.addEventListener('beforeunload', () => this.destroy());
  }

  destroy() {
    this.header.destroy();
    if (this.sidebar) this.sidebar.destroy();
    this.cardGrid.destroy();
    if (this.modal) this.modal.destroy();
  }

  async init() {
    try {
      await Promise.all([
        this.header.load(),
        this.cardGrid.load(),
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
      this._wireSidebarHandlers();
    })();
    return this._sidebarReady;
  }

  async _loadModal() {
    if (this._modalReady) return this._modalReady;
    this._modalReady = (async () => {
      const { Modal } = await import('./views/modal/modal.js');
      this.modal = new Modal('modal-container');
      await this.modal.load();
    })();
    return this._modalReady;
  }

  _wireSidebarHandlers() {
    if (!this.sidebar) return;

    this.sidebar.onTabSwitch = (tabKey) => {
      this.state.activeTab = tabKey;
      this.header.setActiveTab(tabKey);
      this.filterAndDisplayCards(true);
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

  setupEventHandlers() {
    this.header.onHamburgerClick = async () => {
      await this._loadSidebar();
      this.toggleSidebar();
    };

    this.header.onTabSwitch = (tabKey) => {
      this.switchTab(tabKey);
    };

    this.cardGrid.onCardClick = async (card) => {
      await this._loadModal();
      this.modal.open(card);
    };

    this.cardGrid.onRetry = () => {
      if (this._retryCount >= this._maxRetries) {
        this.cardGrid.setError('Unable to load content after several attempts. Please refresh the page.');
        return;
      }
      this._retryCount++;
      this.filterAndDisplayCards();
    };

    const sidebarOverlay = document.getElementById('sidebar-overlay');
    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', () => {
        this.toggleSidebar();
      });
    }
  }

  switchTab(tabKey) {
    this.state.activeTab = tabKey;
    if (this.sidebar) this.sidebar.switchTab(tabKey);
    this.filterAndDisplayCards(true);
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
      if (this.state.isSidebarOpen) {
        overlay.classList.remove('hidden');
      } else {
        overlay.classList.add('hidden');
      }
    }
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
        this.cardGrid.setCards(filtered);

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
