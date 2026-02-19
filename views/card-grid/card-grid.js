import { escapeHtml } from '../../src/lib/dom.js';

const ROW_HEIGHT = 320;
const OVERSCAN = 3;

export class CardGrid {
  constructor(containerId) {
    this.containerId = containerId;
    this.cards = [];
    this._cardMap = new Map();
    this.loading = false;
    this.error = null;
    this.onCardClick = null;
    this._transitionTimer = null;
    this._scrollHandler = null;
    this._resizeObserver = null;
    this._colCount = 2;
    this._renderedRange = { start: 0, end: 0 };
  }

  async load() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    try {
      const response = await fetch('/views/card-grid/card-grid.html');
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
      this._destroyVirtualScroll();
      this.renderCards();
    }
  }

  _showSpinner() {
    const gridContainer = document.getElementById('card-grid-container');
    if (!gridContainer) return;

    gridContainer.classList.add('grid-content-exit');
    clearTimeout(this._transitionTimer);
    this._transitionTimer = setTimeout(() => {
      this._destroyVirtualScroll();
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
    this._destroyVirtualScroll();
  }

  _destroyVirtualScroll() {
    if (this._scrollHandler) {
      const scrollEl = this._getScrollContainer();
      if (scrollEl) scrollEl.removeEventListener('scroll', this._scrollHandler);
      this._scrollHandler = null;
    }
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
  }

  _getScrollContainer() {
    const gridContainer = document.getElementById('card-grid-container');
    return gridContainer ? gridContainer.closest('.overflow-y-auto, main, [data-scroll]') || gridContainer.parentElement : null;
  }

  _measureColCount(gridContainer) {
    const style = window.getComputedStyle(gridContainer);
    const cols = style.getPropertyValue('grid-template-columns');
    if (!cols || cols === 'none') return 2;
    return cols.trim().split(/\s+/).length || 2;
  }

  _buildImageHTML(card) {
    const src = escapeHtml(card.image);
    const alt = escapeHtml(card.title);
    const base = src.replace(/\.[^.]+$/, '');
    const ext = src.match(/\.([^.?]+)(\?|$)/)?.[1] || '';

    if (ext && ['png', 'jpg', 'jpeg'].includes(ext.toLowerCase())) {
      return `<img
        class="w-full h-full object-cover rounded-sm"
        alt="${alt}"
        src="${src}"
        srcset="${base}-320w.${ext} 320w, ${base}-480w.${ext} 480w, ${src} 640w"
        sizes="(max-width: 640px) 160px, (max-width: 1024px) 240px, 280px"
        loading="lazy"
        decoding="async"
      />`;
    }
    return `<img class="w-full h-full object-cover rounded-sm" alt="${alt}" src="${src}" loading="lazy" decoding="async" />`;
  }

  renderCards() {
    const gridContainer = document.getElementById('card-grid-container');
    if (!gridContainer) return;

    this._destroyVirtualScroll();

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
        <div class="col-span-full justify-self-stretch flex flex-col items-center justify-center py-20 px-4 w-full card-fade-in">
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

    if (this.cards.length <= 40) {
      const cardsHTML = this.cards.map((card, i) => {
        const delay = Math.min(i * 30, 300);
        return `
        <div class="w-full max-w-[560px] flex flex-col card-fade-in" style="animation-delay: ${delay}ms">
          <div class="group cursor-pointer" data-action="open-card" data-card-id="${escapeHtml(card.id)}">
            <div class="bg-white border border-gray-200 rounded-lg hover:transform hover:scale-105 transition-transform duration-200 shadow-sm hover:shadow-md mb-2 sm:mb-3">
              <div class="p-2 sm:p-3 md:p-4">
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
      `}).join('');
      gridContainer.innerHTML = cardsHTML;
      return;
    }

    this._setupVirtualScroll(gridContainer);
  }

  _setupVirtualScroll(gridContainer) {
    this._colCount = this._measureColCount(gridContainer);
    const rowCount = Math.ceil(this.cards.length / this._colCount);
    const totalHeight = rowCount * ROW_HEIGHT;

    gridContainer.style.position = 'relative';
    gridContainer.style.height = `${totalHeight}px`;
    gridContainer.innerHTML = '';

    const scrollEl = this._getScrollContainer();

    const render = () => {
      const scrollTop = scrollEl ? scrollEl.scrollTop : window.scrollY;
      const viewportH = scrollEl ? scrollEl.clientHeight : window.innerHeight;

      const firstVisibleRow = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
      const lastVisibleRow = Math.min(rowCount - 1, Math.ceil((scrollTop + viewportH) / ROW_HEIGHT) + OVERSCAN);

      const startIdx = firstVisibleRow * this._colCount;
      const endIdx = Math.min(this.cards.length - 1, (lastVisibleRow + 1) * this._colCount - 1);

      if (startIdx === this._renderedRange.start && endIdx === this._renderedRange.end) return;

      const toRemove = gridContainer.querySelectorAll('[data-vrow]');
      toRemove.forEach(el => {
        const rowIdx = parseInt(el.dataset.vrow, 10);
        const rowStart = rowIdx * this._colCount;
        const rowEnd = Math.min(this.cards.length - 1, rowStart + this._colCount - 1);
        if (rowStart > endIdx || rowEnd < startIdx) el.remove();
      });

      for (let row = firstVisibleRow; row <= lastVisibleRow; row++) {
        if (gridContainer.querySelector(`[data-vrow="${row}"]`)) continue;
        const rowEl = document.createElement('div');
        rowEl.dataset.vrow = row;
        rowEl.style.cssText = `position:absolute;top:${row * ROW_HEIGHT}px;left:0;right:0;display:contents`;
        const rowStart = row * this._colCount;
        const rowEnd = Math.min(this.cards.length - 1, rowStart + this._colCount - 1);
        for (let ci = rowStart; ci <= rowEnd; ci++) {
          const card = this.cards[ci];
          const delay = Math.min(ci * 30, 300);
          const cardHTML = `
            <div class="w-full max-w-[560px] flex flex-col card-fade-in" style="animation-delay:${delay}ms">
              <div class="group cursor-pointer" data-action="open-card" data-card-id="${escapeHtml(card.id)}">
                <div class="bg-white border border-gray-200 rounded-lg hover:transform hover:scale-105 transition-transform duration-200 shadow-sm hover:shadow-md mb-2 sm:mb-3">
                  <div class="p-2 sm:p-3 md:p-4">
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
          const wrap = document.createElement('div');
          wrap.innerHTML = cardHTML;
          rowEl.appendChild(wrap.firstElementChild);
        }
        gridContainer.appendChild(rowEl);
      }

      this._renderedRange = { start: startIdx, end: endIdx };
    };

    render();

    this._scrollHandler = render;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', this._scrollHandler, { passive: true });
    }

    this._resizeObserver = new ResizeObserver(() => {
      const newCols = this._measureColCount(gridContainer);
      if (newCols !== this._colCount) {
        this._colCount = newCols;
        this._renderedRange = { start: 0, end: 0 };
        gridContainer.innerHTML = '';
      }
      render();
    });
    this._resizeObserver.observe(gridContainer);
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
