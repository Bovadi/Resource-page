import { DEMO_LABELS, DEMO_CARDS } from './data/demoData.js';
import './styles/responsive-grid.css';

export class App {
  constructor() {
    this.state = {
      activeTab: 'resources',
      selectedLabel: null,
      displayedCards: [],
      loading: false,
      error: null,
      isSidebarOpen: false,
      isModalOpen: false,
      selectedCard: null
    };

    this.labels = DEMO_LABELS;
    this.allCards = DEMO_CARDS;
    this.init();
  }

  async init() {
    this.filterCards();
    this.render();
  }

  getCardType() {
    return this.state.activeTab === 'courses' ? 'course' : 'resource';
  }

  filterCards() {
    const isInitialLoad = this.state.displayedCards.length === 0;
    if (isInitialLoad) {
      this.state.loading = true;
      this.render();
    }

    this.state.error = null;

    try {
      let filtered = this.allCards.filter(card => card.type === this.getCardType());

      // Apply label filter if one is selected
      if (this.state.selectedLabel === 'visual-supports') {
        filtered = filtered.filter(card =>
          card.title.toLowerCase().includes('visual') ||
          card.title.toLowerCase().includes('poster')
        );
      }

      this.state.displayedCards = filtered;
    } catch (err) {
      console.error('Filter error:', err);
      this.state.error = 'Failed to load content';
      this.state.displayedCards = [];
    } finally {
      if (isInitialLoad) {
        this.state.loading = false;
      }
      this.render();
    }
  }

  switchTab(tabKey) {
    if (tabKey === this.state.activeTab || this.state.loading) return;
    this.state.activeTab = tabKey;
    this.filterCards();
  }

  selectLabel(labelSlug) {
    this.state.selectedLabel = labelSlug;
    this.state.isSidebarOpen = false;
    this.filterCards();
  }

  openModal(card) {
    this.state.selectedCard = card;
    this.state.isModalOpen = true;
    this.render();
  }

  closeModal() {
    this.state.isModalOpen = false;
    this.render();
  }

  toggleSidebar() {
    this.state.isSidebarOpen = !this.state.isSidebarOpen;
    this.render();
  }

  renderHeader() {
    return `
      <header class="fixed top-0 left-0 right-0 w-full h-[61px] bg-[#f8f5ef] z-20">
        <div class="flex items-center justify-between px-4 sm:px-5 h-full">
          <div class="flex items-center gap-2 sm:gap-4">
            <button id="hamburger-btn" class="lg:hidden p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200 -ml-2">
              <svg class="w-6 h-6 text-[#343434]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                ${this.state.isSidebarOpen ?
                  '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />' :
                  '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />'
                }
              </svg>
            </button>
            <img class="h-4 sm:h-6 w-auto object-contain" alt="Logo" src="/large-3.png" />
          </div>

          <div class="hidden md:flex items-center gap-4 lg:gap-6 h-full">
            <div class="flex flex-col w-16 lg:w-[88px] h-full items-center justify-end gap-2">
              <span class="font-normal text-[#343434] text-sm lg:text-base">BIPs</span>
              <div class="w-full h-[3px]"></div>
            </div>
            <div class="flex flex-col w-16 lg:w-[88px] h-full items-center justify-end gap-2">
              <span class="font-normal text-[#343434] text-sm lg:text-base">Resources</span>
              <div class="w-full h-[3px] bg-[#343434]"></div>
            </div>
            <div class="flex flex-col w-16 lg:w-[88px] h-full items-center justify-end gap-2">
              <span class="font-normal text-[#343434] text-sm lg:text-base">Strategies</span>
              <div class="w-full h-[3px]"></div>
            </div>
          </div>

          <button class="bg-white border-[#343434] border rounded h-8 sm:h-10 px-2 sm:px-3 text-xs sm:text-base hover:bg-gray-50 transition-colors">
            <span class="font-semibold text-[#343434]">Admin Login</span>
            <img class="w-2 sm:w-3 h-3 sm:h-4 ml-1 sm:ml-2 inline" alt="Vector" src="/vector.svg" />
          </button>
        </div>
        <div class="w-full h-px bg-[#d9d9d9]"></div>
      </header>
    `;
  }

  renderSidebar() {
    const activeLabelClass = "bg-[#f8f8f9] text-[#343434] shadow-sm border border-gray-100 font-medium";
    const inactiveLabelClass = "text-gray-600 hover:text-[#343434] hover:bg-gray-50 border border-transparent";
    const baseButtonClass = "w-full text-left py-3 px-4 text-sm sm:text-base rounded-lg transition-all duration-200 hover:bg-[#f0f0f1] hover:shadow-sm active:scale-[0.98] min-h-[48px] flex items-center box-border";

    return `
      <aside class="fixed top-[61px] left-0 w-[280px] sm:w-[320px] lg:w-72 h-[calc(100vh-61px)] bg-white z-40 lg:z-10 lg:relative lg:top-0 transition-transform duration-300 ease-in-out ${
        this.state.isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }">
        <nav class="p-4 sm:p-5 lg:p-6 lg:pt-[72px] h-full overflow-y-auto">
          <ul class="space-y-2 lg:space-y-3">
            <li>
              <button data-action="show-all" class="${baseButtonClass} ${this.state.selectedLabel === null ? activeLabelClass : inactiveLabelClass}">
                <span>Show All</span>
              </button>
            </li>
            ${this.labels.map(label => `
              <li>
                <button data-action="select-label" data-label="${label.slug}" class="${baseButtonClass} ${
                  this.state.selectedLabel === label.slug ? activeLabelClass : inactiveLabelClass
                }">
                  <span>${label.name}</span>
                </button>
              </li>
            `).join('')}
          </ul>
        </nav>
      </aside>
    `;
  }

  renderCardGrid() {
    if (this.state.error) {
      return `
        <div class="col-span-full flex flex-col items-center justify-center py-12 px-4">
          <div class="text-center max-w-md">
            <div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
            <p class="text-gray-600 mb-4">${this.state.error}</p>
            <button data-action="retry" class="px-4 py-2 bg-[#108C89] text-white rounded-lg hover:bg-[#0e7a77] transition-colors duration-200">
              Try Again
            </button>
          </div>
        </div>
      `;
    }

    if (this.state.loading) {
      return Array(8).fill(null).map(() => `
        <div class="w-full max-w-[560px] cursor-pointer group animate-pulse">
          <div class="bg-white border border-gray-200 rounded-lg shadow-sm mb-2 sm:mb-3 p-2 sm:p-3 md:p-4">
            <div class="relative w-full aspect-[246/252] bg-gray-200 rounded-sm"></div>
          </div>
          <div class="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mx-1"></div>
        </div>
      `).join('');
    }

    return this.state.displayedCards.map(card => `
      <div class="w-full max-w-[560px] flex flex-col">
        <div class="group cursor-pointer" data-action="open-card" data-card-id="${card.id}">
          <div class="bg-white border border-gray-200 rounded-lg hover:transform hover:scale-105 transition-transform duration-200 shadow-sm hover:shadow-md mb-2 sm:mb-3">
            <div class="p-2 sm:p-3 md:p-4">
              <div class="relative w-full aspect-[246/252]">
                <img class="w-full h-full object-cover rounded-sm" alt="${card.title}" src="${card.image}" loading="lazy" />
                ${card.type === 'resource' ? `
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                    <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full p-2 shadow-lg">
                      <svg class="w-5 h-5 sm:w-6 sm:h-6 text-custom-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
        <div class="px-1">
          <p class="font-normal text-[#343434] text-xs sm:text-sm leading-tight sm:leading-[16.8px] text-left transition-colors duration-200 line-clamp-2 overflow-hidden">
            ${card.title}
          </p>
        </div>
      </div>
    `).join('');
  }

  renderModal() {
    if (!this.state.isModalOpen || !this.state.selectedCard) return '';

    const card = this.state.selectedCard;
    const isResource = card.type === 'resource';

    return `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300">
        <div data-action="close-modal" class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"></div>

        <div class="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300">
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">
              ${isResource ? 'Download Resource' : 'Start new course'}
            </h2>
            <button data-action="close-modal" class="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="overflow-y-auto max-h-[calc(90vh-180px)]">
            <div class="p-4 sm:p-6">
              <div class="mb-4 sm:mb-6">
                <div class="w-full h-64 rounded-lg flex items-center justify-center" style="background-color: #F7F7F7">
                  <img src="${card.image}" alt="${card.title}" class="max-w-full max-h-full object-contain rounded-lg" />
                </div>
              </div>

              <h3 class="text-2xl font-bold text-gray-900 mb-4">${card.title}</h3>

              <div class="space-y-4 text-gray-700 mb-4">
                <p class="leading-relaxed">${card.description || 'Description not available.'}</p>

                <div class="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h4 class="font-semibold text-gray-900 mb-3">Perfect for:</h4>
                  ${card.perfect_for && card.perfect_for.length > 0 ? `
                    <ul class="space-y-2 text-sm">
                      ${card.perfect_for.map(item => `
                        <li class="flex items-start">
                          <span class="w-2 h-2 bg-custom-teal rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          ${item}
                        </li>
                      `).join('')}
                    </ul>
                  ` : `
                    <p class="text-sm text-gray-500 italic">No specific use cases defined.</p>
                  `}
                </div>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-200 p-4 sm:p-6 flex-shrink-0">
            <button data-action="start-action" class="w-full bg-[#108C89] text-white py-3 px-4 rounded-lg hover:bg-[#0e7a77] transition-colors duration-200 font-medium min-h-[48px]">
              ${isResource ? 'Download Resource' : 'Start Course'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const appContainer = document.getElementById('app');
    if (!appContainer) return;

    const activeTabClass = "bg-[#f8f8f9] text-[#343434] shadow-sm";
    const inactiveTabClass = "text-gray-600 hover:text-[#343434] hover:bg-gray-50 border border-transparent";
    const tabButtonClass = "px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg transition-colors duration-200 min-h-[44px] sm:min-h-[48px] flex items-center box-border";

    appContainer.innerHTML = `
      <div class="fixed inset-0 w-full h-screen bg-white border border-solid border-black overflow-hidden">
        ${this.renderHeader()}

        ${this.state.isSidebarOpen ? `
          <div data-action="close-sidebar" class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"></div>
        ` : ''}

        <div class="fixed top-[61px] left-0 right-0 bottom-0 flex flex-col lg:flex-row">
          ${this.renderSidebar()}

          <div class="flex-1 flex flex-col w-full lg:ml-0">
            <div class="w-full flex items-center px-4 py-3 sm:py-4 bg-white lg:bg-transparent z-10 border-b lg:border-b-0 border-gray-200 gap-3 sm:gap-4">
              <button data-action="switch-tab" data-tab="courses" class="${tabButtonClass} ${this.state.activeTab === 'courses' ? activeTabClass : inactiveTabClass}">
                Courses
              </button>
              <button data-action="switch-tab" data-tab="resources" class="${tabButtonClass} ${this.state.activeTab === 'resources' ? activeTabClass : inactiveTabClass}">
                Resources
              </button>
            </div>

            <main class="flex-1 w-full overflow-y-auto p-4 sm:p-5 lg:px-6 lg:pt-6 lg:pb-6 bg-[#F8F5EF] lg:rounded-tl-[16px]">
              <div class="min-h-full">
                <div class="grid gap-3 sm:gap-4 md:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 4xl:grid-cols-8 justify-items-start">
                  ${this.renderCardGrid()}
                </div>
              </div>
            </main>
          </div>
        </div>

        ${this.renderModal()}
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    // Use event delegation with data-action attributes
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;

      const action = target.dataset.action;

      switch (action) {
        case 'close-sidebar':
        case 'hamburger-btn':
          this.toggleSidebar();
          break;

        case 'show-all':
          this.selectLabel(null);
          break;

        case 'select-label':
          this.selectLabel(target.dataset.label);
          break;

        case 'switch-tab':
          this.switchTab(target.dataset.tab);
          break;

        case 'open-card': {
          const cardId = target.dataset.cardId;
          const card = this.state.displayedCards.find(c => c.id === cardId);
          if (card) this.openModal(card);
          break;
        }

        case 'close-modal':
          this.closeModal();
          break;

        case 'start-action':
          if (this.state.selectedCard?.download_url) {
            window.open(this.state.selectedCard.download_url, '_blank');
          }
          this.closeModal();
          break;

        case 'retry':
          this.filterCards();
          break;
      }
    });

    // Handle hamburger button separately since it's a specific ID
    const hamburgerBtn = document.getElementById('hamburger-btn');
    if (hamburgerBtn) {
      hamburgerBtn.dataset.action = 'hamburger-btn';
    }
  }
}
