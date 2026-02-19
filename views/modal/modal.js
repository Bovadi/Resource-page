export class Modal {
  constructor(containerId) {
    this.containerId = containerId;
    this.currentCard = null;
    this.isOpen = false;
    this.onClose = null;
    this.onAction = null;
    this._keydownHandler = null;
    this._hideTimer = null;
  }

  async load() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    try {
      const response = await fetch('/views/modal/modal.html');
      if (!response.ok) {
        throw new Error(`Failed to load modal: ${response.status}`);
      }
      const html = await response.text();
      container.innerHTML = html;
      this.attachEventListeners();
    } catch (err) {
      console.error('Modal load error:', err);
      container.innerHTML = '';
    }
  }

  destroy() {
    if (this._keydownHandler) {
      document.removeEventListener('keydown', this._keydownHandler);
      this._keydownHandler = null;
    }
    clearTimeout(this._hideTimer);
    this._hideTimer = null;
  }

  open(card) {
    this.currentCard = card;
    this.isOpen = true;
    this.updateContent();
    this.show();
  }

  close() {
    this.isOpen = false;
    this.hide();
    if (this.onClose) {
      this.onClose();
    }
  }

  show() {
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) return;
    clearTimeout(this._hideTimer);
    requestAnimationFrame(() => {
      modalContainer.classList.add('modal-is-open');
    });
  }

  hide() {
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) return;
    modalContainer.classList.remove('modal-is-open');
    this._hideTimer = setTimeout(() => {
      this._hideTimer = null;
    }, 220);
  }

  updateContent() {
    if (!this.currentCard) return;

    const isResource = this.currentCard.type === 'resource';

    const titleElement = document.getElementById('modal-title');
    if (titleElement) {
      titleElement.textContent = isResource ? 'Download Resource' : 'Start new course';
    }

    const imageElement = document.getElementById('modal-image');
    if (imageElement) {
      imageElement.src = this.currentCard.image;
      imageElement.alt = this.currentCard.title;
      imageElement.onerror = () => {
        imageElement.src = 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=600';
        imageElement.onerror = null;
      };
    }

    const cardTitleElement = document.getElementById('modal-card-title');
    if (cardTitleElement) {
      cardTitleElement.textContent = this.currentCard.title;
    }

    const descriptionElement = document.getElementById('modal-description');
    if (descriptionElement) {
      descriptionElement.textContent = this.currentCard.description || 'Description not available.';
    }

    const perfectForList = document.getElementById('modal-perfect-for');
    if (perfectForList) {
      perfectForList.innerHTML = '';
      if (this.currentCard.perfect_for && this.currentCard.perfect_for.length > 0) {
        this.currentCard.perfect_for.forEach(item => {
          const li = document.createElement('li');
          li.className = 'flex items-start';
          const dot = document.createElement('span');
          dot.className = 'w-2 h-2 bg-[#108C89] rounded-full mt-2 mr-3 flex-shrink-0';
          const text = document.createTextNode(item);
          li.appendChild(dot);
          li.appendChild(text);
          perfectForList.appendChild(li);
        });
      } else {
        const p = document.createElement('p');
        p.className = 'text-sm text-gray-500 italic';
        p.textContent = 'No specific use cases defined.';
        perfectForList.appendChild(p);
      }
    }

    const actionTextElement = document.getElementById('modal-action-text');
    if (actionTextElement) {
      actionTextElement.textContent = isResource ? 'Download Resource' : 'Start Course';
    }
  }

  attachEventListeners() {
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) return;

    modalContainer.addEventListener('click', (e) => {
      const closeButton = e.target.closest('[data-action="close-modal"]');
      if (closeButton) {
        this.close();
        return;
      }

      const actionButton = e.target.closest('[data-action="start-action"]');
      if (actionButton) {
        if (this.currentCard?.download_url) {
          window.open(this.currentCard.download_url, '_blank');
        }
        if (this.onAction) {
          this.onAction(this.currentCard);
        }
        this.close();
      }
    });

    this._keydownHandler = (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    };
    document.addEventListener('keydown', this._keydownHandler);
  }
}
