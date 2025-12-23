export class Modal {
  constructor(containerId) {
    this.containerId = containerId;
    this.currentCard = null;
    this.isOpen = false;
    this.onClose = null;
    this.onAction = null;
  }

  async load() {
    const response = await fetch('/views/modal/modal.html');
    const html = await response.text();
    const container = document.getElementById(this.containerId);
    if (container) {
      container.innerHTML = html;
      this.attachEventListeners();
    }
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
    if (modalContainer) {
      modalContainer.classList.remove('hidden');
      modalContainer.classList.add('flex');
    }
  }

  hide() {
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) {
      modalContainer.classList.add('hidden');
      modalContainer.classList.remove('flex');
    }
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
      if (this.currentCard.perfect_for && this.currentCard.perfect_for.length > 0) {
        perfectForList.innerHTML = this.currentCard.perfect_for.map(item => `
          <li class="flex items-start">
            <span class="w-2 h-2 bg-[#108C89] rounded-full mt-2 mr-3 flex-shrink-0"></span>
            ${item}
          </li>
        `).join('');
      } else {
        perfectForList.innerHTML = '<p class="text-sm text-gray-500 italic">No specific use cases defined.</p>';
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
  }
}
