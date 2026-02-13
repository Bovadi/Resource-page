export class CardGrid {
  constructor(containerId) {
    this.containerId = containerId;
    this.cards = [];
    this.loading = false;
    this.error = null;
    this.onCardClick = null;
  }

  async load() {
    const response = await fetch('/views/card-grid/card-grid.html');
    const html = await response.text();
    const container = document.getElementById(this.containerId);
    if (container) {
      container.innerHTML = html;
      this.attachEventListeners();
    }
  }

  setCards(cards) {
    this.cards = cards;
    this.renderCards();
  }

  setLoading(loading) {
    this.loading = loading;
    this.renderCards();
  }

  setError(error) {
    this.error = error;
    this.renderCards();
  }

  renderCards() {
    const gridContainer = document.getElementById('card-grid-container');
    if (!gridContainer) return;

    if (this.error) {
      gridContainer.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center py-12 px-4">
          <div class="text-center max-w-md">
            <div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
            <p class="text-gray-600 mb-4">${this.error}</p>
            <button data-action="retry" class="px-4 py-2 bg-[#108C89] text-white rounded-lg hover:bg-[#0e7a77] transition-colors duration-200">
              Try Again
            </button>
          </div>
        </div>
      `;
      return;
    }

    if (this.loading) {
      const skeletons = Array(8).fill(null).map(() => `
        <div class="w-full max-w-[672px] cursor-pointer group animate-pulse">
          <div class="bg-white border border-gray-200 rounded-lg shadow-sm mb-3 sm:mb-4 p-3 sm:p-4 md:p-5">
            <div class="relative w-full aspect-[295/302] bg-gray-200 rounded-sm"></div>
          </div>
          <div class="h-4 sm:h-5 bg-gray-200 rounded w-3/4 mx-1"></div>
        </div>
      `).join('');
      gridContainer.innerHTML = skeletons;
      return;
    }

    const cardsHTML = this.cards.map(card => `
      <div class="w-full max-w-[672px] flex flex-col">
        <div class="group cursor-pointer" data-action="open-card" data-card-id="${card.id}">
          <div class="bg-white border border-gray-200 rounded-lg hover:transform hover:scale-105 transition-transform duration-200 shadow-sm hover:shadow-md mb-3 sm:mb-4">
            <div class="p-3 sm:p-4 md:p-5">
              <div class="relative w-full aspect-[295/302]">
                <img class="w-full h-full object-cover rounded-sm" alt="${card.title}" src="${card.image}" loading="lazy" />
                ${card.type === 'resource' ? `
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                    <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full p-2 shadow-lg">
                      <svg class="w-5 h-5 sm:w-6 sm:h-6 text-[#108C89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <p class="font-normal text-[#343434] text-sm sm:text-base leading-snug sm:leading-[20px] text-left transition-colors duration-200 line-clamp-2 overflow-hidden">
            ${card.title}
          </p>
        </div>
      </div>
    `).join('');

    gridContainer.innerHTML = cardsHTML;
  }

  attachEventListeners() {
    const mainElement = document.querySelector('main');
    if (!mainElement) return;

    mainElement.addEventListener('click', (e) => {
      const cardElement = e.target.closest('[data-action="open-card"]');
      if (cardElement && this.onCardClick) {
        const cardId = cardElement.dataset.cardId;
        const card = this.cards.find(c => c.id === cardId);
        if (card) {
          this.onCardClick(card);
        }
      }

      const retryButton = e.target.closest('[data-action="retry"]');
      if (retryButton && this.onRetry) {
        this.onRetry();
      }
    });
  }
}
