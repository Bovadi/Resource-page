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
      filters: {
        madeByYou: false,
        sharedWithYou: false
      }
    };

    this.allCards = SAMPLE_CARDS;

    this.header = new Header('header-container');
    this.sidebar = new Sidebar('sidebar-container');
    this.cardGrid = new CardGrid('main-container');
    this.modal = new Modal('modal-container');

    this.init();
  }

  async init() {
    await this.loadComponents();
    this.setupEventHandlers();
    this.filterAndDisplayCards();
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

    this.sidebar.onFilterChange = (filters) => {
      this.state.filters = filters;
      this.filterAndDisplayCards();
    };

    this.sidebar.onActionClick = (action) => {
      console.log('Action clicked:', action);
    };

    this.cardGrid.onCardClick = (card) => {
      this.modal.open(card);
    };

    this.cardGrid.onRetry = () => {
      this.filterAndDisplayCards();
    };

    const sidebarOverlay = document.getElementById('sidebar-overlay');
    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', () => {
        this.toggleSidebar();
      });
    }
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

  filterAndDisplayCards() {
    this.cardGrid.setLoading(true);
    this.cardGrid.setError(null);

    try {
      let filtered = this.allCards.filter(card => card.type === this.getCardType());

      setTimeout(() => {
        this.cardGrid.setLoading(false);
        this.cardGrid.setCards(filtered);
      }, 300);

    } catch (err) {
      console.error('Filter error:', err);
      this.cardGrid.setError('Failed to load content');
      this.cardGrid.setLoading(false);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});
