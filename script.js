import { Header } from './views/header/header.js';
import { Sidebar } from './views/sidebar/sidebar.js';
import { Tabs } from './views/tabs/tabs.js';
import { CardGrid } from './views/card-grid/card-grid.js';
import { Modal } from './views/modal/modal.js';
import { DEMO_LABELS, DEMO_CARDS } from './src/data/demoData.js';

class App {
  constructor() {
    this.state = {
      activeTab: 'resources',
      selectedLabel: null,
      isSidebarOpen: false
    };

    this.labels = DEMO_LABELS;
    this.allCards = DEMO_CARDS;

    this.header = new Header('header-container');
    this.sidebar = new Sidebar('sidebar-container', this.labels);
    this.tabs = new Tabs('tabs-container');
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
      this.tabs.load(),
      this.cardGrid.load(),
      this.modal.load()
    ]);
  }

  setupEventHandlers() {
    this.header.onHamburgerClick = () => {
      this.toggleSidebar();
    };

    this.sidebar.onLabelSelect = (labelSlug) => {
      this.state.selectedLabel = labelSlug;
      this.state.isSidebarOpen = false;
      this.sidebar.close();
      this.filterAndDisplayCards();
    };

    this.tabs.onTabSwitch = (tabKey) => {
      this.state.activeTab = tabKey;
      this.filterAndDisplayCards();
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

      if (this.state.selectedLabel === 'visual-supports') {
        filtered = filtered.filter(card =>
          card.title.toLowerCase().includes('visual') ||
          card.title.toLowerCase().includes('poster')
        );
      }

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
