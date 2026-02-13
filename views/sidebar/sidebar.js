export class Sidebar {
  constructor(containerId) {
    this.containerId = containerId;
    this.isOpen = false;
    this.onActionClick = null;
  }

  async load() {
    const response = await fetch('/views/sidebar/sidebar.html');
    const html = await response.text();
    const container = document.getElementById(this.containerId);
    if (container) {
      container.innerHTML = html;
      this.renderActions();
      this.attachEventListeners();
    }
  }

  renderActions() {
    const actionsContainer = document.getElementById('sidebar-actions');
    if (!actionsContainer) return;

    const buttonBaseClass = "w-full flex items-center gap-3 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 active:scale-[0.98] min-h-[48px]";

    const actionsHTML = `
      <button data-action="generate-bip" class="${buttonBaseClass} bg-[#343434] text-white hover:bg-[#4a4a4a] shadow-sm">
        <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
          <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>
          <path d="M12 8v-2" stroke-linecap="round"/>
          <path d="M12 18v-2" stroke-linecap="round"/>
          <path d="M8 12H6" stroke-linecap="round"/>
          <path d="M18 12h-2" stroke-linecap="round"/>
        </svg>
        <span>Generate BIP</span>
      </button>
      <button data-action="create-bip-new" class="${buttonBaseClass} bg-white text-[#343434] border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm">
        <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="12" y1="18" x2="12" y2="12"/>
          <line x1="9" y1="15" x2="15" y2="15"/>
        </svg>
        <span>Create BIP (New Builder)</span>
      </button>
      <button data-action="create-bip-legacy" class="${buttonBaseClass} bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300">
        <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
        <span>Create BIP (Legacy Builder)</span>
      </button>
    `;

    actionsContainer.innerHTML = actionsHTML;
  }

  attachEventListeners() {
    const actionsContainer = document.getElementById('sidebar-actions');
    if (actionsContainer) {
      actionsContainer.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        const action = button.dataset.action;
        if (action && this.onActionClick) {
          this.onActionClick(action);
        }
      });
    }

  }

  toggle() {
    this.isOpen = !this.isOpen;
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      if (this.isOpen) {
        sidebar.classList.remove('-translate-x-full');
      } else {
        sidebar.classList.add('-translate-x-full');
      }
    }
  }

  close() {
    this.isOpen = false;
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.add('-translate-x-full');
    }
  }
}
