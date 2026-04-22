import { escapeHtml } from '../../src/lib/dom.js';

export class CardGrid {
  constructor(containerId) {
    this.containerId = containerId;
    this.cards = [];
    this._cardMap = new Map();
    this.loading = false;
    this.error = null;
    this.onCardClick = null;
    this._transitionTimer = null;
  }

  async load() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    try {
      const response = await fetch(`${import.meta.env.BASE_URL}views/card-grid/card-grid.html`);
      if (!response.ok) {
        throw new Error(`Failed to load card grid: ${response.status}`);
      }
      const html = await response.text();
      container.innerHTML = html;
      this.attachEventListeners();
    } catch (err) {
      console.error('Card grid load error:', err);
      container.innerHTML = '<p class="p-8 text-center text-red-600">Failed to load content area.</p>';
    }
  }

  setCards(cards) {
    this.cards = cards;
    this._cardMap = new Map(cards.map(c => [String(c.id), c]));
    this.loading = false;
    this.error = null;
    this._transitionToContent();
  }

  setLoading(loading) {
    this.loading = loading;
    if (loading) {
      this._showSpinner();
    }
  }

  setError(error) {
    this.error = error;
    if (error) {
      this.renderCards();
    }
  }

  _showSpinner() {
    const gridContainer = document.getElementById('card-grid-container');
    if (!gridContainer) return;

    gridContainer.classList.add('grid-content-exit');
    clearTimeout(this._transitionTimer);
    this._transitionTimer = setTimeout(() => {
      gridContainer.innerHTML = `
        <div class="grid-spinner">
          <div class="grid-spinner-dot"></div>
          <div class="grid-spinner-dot"></div>
          <div class="grid-spinner-dot"></div>
        </div>
      `;
      gridContainer.classList.remove('grid-content-exit');
    }, 150);
  }

  _transitionToContent() {
    clearTimeout(this._transitionTimer);

    const gridContainer = document.getElementById('card-grid-container');
    if (!gridContainer) return;

    gridContainer.classList.add('grid-content-exit');

    requestAnimationFrame(() => {
      this._transitionTimer = setTimeout(() => {
        this._transitionTimer = null;
        this.renderCards();
        gridContainer.classList.remove('grid-content-exit');
      }, 120);
    });
  }

  destroy() {
    clearTimeout(this._transitionTimer);
    this._transitionTimer = null;
  }

  _buildImageHTML(card) {
    const src = escapeHtml(card.image);
    const alt = escapeHtml(card.title);
    return `<img class="w-full h-full object-cover rounded-sm" alt="${alt}" src="${src}" loading="lazy" decoding="async" />`;
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
      gridContainer.innerHTML = `
        <div class="grid-spinner">
          <div class="grid-spinner-dot"></div>
          <div class="grid-spinner-dot"></div>
          <div class="grid-spinner-dot"></div>
        </div>
      `;
      return;
    }

    if (this.cards.length === 0) {
      gridContainer.innerHTML = `
        <div class="col-span-full justify-self-stretch flex flex-col items-center justify-center min-h-[calc(100vh-7.5rem)] px-4 w-full card-fade-in">
          <div class="text-center max-w-sm">
            <div class="flex items-center justify-center mb-4">
              <svg class="w-14 h-14 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Nothing here yet.</h3>
            <p class="text-sm text-gray-400">Try adjusting your filters to find what you're looking for.</p>
          </div>
        </div>
      `;
      return;
    }

    const cardsHTML = this.cards.map((card, i) => {
      const delay = Math.min(i * 30, 300);
      return `
        <div class="w-full max-w-[560px] flex flex-col card-fade-in" style="animation-delay: ${delay}ms">
          <div class="group cursor-pointer" data-action="open-card" data-card-id="${escapeHtml(card.id)}">
            <div class="bg-white border border-gray-200 rounded-lg hover:transform hover:scale-105 transition-transform duration-200 shadow-sm hover:shadow-md mb-2 sm:mb-3">
              <div class="p-2">
                <div class="relative w-full aspect-[246/252]">
                  ${this._buildImageHTML(card)}
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
      `;
    }).join('');
    gridContainer.innerHTML = cardsHTML;
  }

  attachEventListeners() {
    const mainElement = document.querySelector('main');
    if (!mainElement) return;

    mainElement.addEventListener('click', (e) => {
      const cardElement = e.target.closest('[data-action="open-card"]');
      if (cardElement && this.onCardClick) {
        const cardId = cardElement.dataset.cardId;
        const card = this._cardMap.get(cardId);
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
