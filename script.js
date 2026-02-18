import { Header } from './views/header/header.js';
import { Sidebar } from './views/sidebar/sidebar.js';
import { CardGrid } from './views/card-grid/card-grid.js';
import { Modal } from './views/modal/modal.js';
import { SAMPLE_CARDS } from './src/data/demoData.js';

class App {
  constructor() {
    this.state = {
      activeTab: 'resources',
      isSidebarOpen: false,
    };

    this.allCards = SAMPLE_CARDS;
    this._filterGeneration = 0;
    this._retryCount = 0;
    this._maxRetries = 3;

    this.header = new Header('header-container');
    this.sidebar = new Sidebar('sidebar-container');
    this.cardGrid = new CardGrid('main-container');
    this.modal = new Modal('modal-container');

    this.init();
  }

  async init() {
    try {
      await this.loadComponents();
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

  async loadComponents() {
    await Promise.all([
      this.header.load(),
      this.sidebar.load(),
      this.cardGrid.load(),
      this.modal.load()
    ]);
  }

  setupEventHandlers() {
    this.header.onHamburgerClick = () => {
      this.toggleSidebar();
    };

    this.header.onTabSwitch = (tabKey) => {
      this.switchTab(tabKey);
    };

    this.sidebar.onTabSwitch = (tabKey) => {
      this.state.activeTab = tabKey;
      this.header.setActiveTab(tabKey);
      this.cardGrid.setLoading(true);
      setTimeout(() => this.filterAndDisplayCards(), 100);
    };

    this.sidebar.onFilterChange = () => {
      this.cardGrid.setLoading(true);
      setTimeout(() => this.filterAndDisplayCards(), 80);
    };

    this.sidebar.onActionClick = (action) => {
      console.log('Action clicked:', action);
    };

    this.sidebar.onClose = () => {
      this.state.isSidebarOpen = false;
      this.header.updateHamburgerIcon(false);
      this.updateSidebarOverlay();
    };

    this.cardGrid.onCardClick = (card) => {
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
    this.sidebar.switchTab(tabKey);
    this.cardGrid.setLoading(true);
    setTimeout(() => this.filterAndDisplayCards(), 100);
  }

  toggleSidebar() {
    this.state.isSidebarOpen = !this.state.isSidebarOpen;
    this.sidebar.toggle();
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
    return this.state.activeTab === 'courses' ? 'course' : 'resource';
  }

  async filterAndDisplayCards() {
    this._filterGeneration++;
    const generation = this._filterGeneration;

    this.cardGrid.setError(null);

    try {
      const filters = this.sidebar.getFilters();
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

      await new Promise(resolve => setTimeout(resolve, 150));

      if (generation !== this._filterGeneration) return;
      this._retryCount = 0;
      this.cardGrid.setCards(filtered);

    } catch (err) {
      console.error('Filter error:', err);
      this.cardGrid.setError('Failed to load content');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});
