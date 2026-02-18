function escapeHtml(value) {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

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
            <p class="text-gray-600 mb-4">${escapeHtml(this.error)}</p>
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
        <div class="w-full max-w-[560px] cursor-pointer group animate-pulse">
          <div class="bg-white border border-gray-200 rounded-lg shadow-sm mb-2 sm:mb-3 p-2 sm:p-3 md:p-4">
            <div class="relative w-full aspect-[246/252] bg-gray-200 rounded-sm"></div>
          </div>
          <div class="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mx-1"></div>
        </div>
      `).join('');
      gridContainer.innerHTML = skeletons;
      return;
    }

    const cardsHTML = this.cards.map(card => `
      <div class="w-full max-w-[560px] flex flex-col">
        <div class="group cursor-pointer" data-action="open-card" data-card-id="${escapeHtml(card.id)}">
          <div class="bg-white border border-gray-200 rounded-lg hover:transform hover:scale-105 transition-transform duration-200 shadow-sm hover:shadow-md mb-2 sm:mb-3">
            <div class="p-2 sm:p-3 md:p-4">
              <div class="relative w-full aspect-[246/252]">
                <img class="w-full h-full object-cover rounded-sm" alt="${escapeHtml(card.title)}" src="${escapeHtml(card.image)}" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
        <div class="px-1">
          <p class="font-normal text-[#343434] text-xs sm:text-sm leading-tight sm:leading-[16.8px] text-left transition-colors duration-200 line-clamp-2 overflow-hidden">
            ${escapeHtml(card.title)}
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
