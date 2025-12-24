export class Sidebar {
  constructor(containerId, labels) {
    this.containerId = containerId;
    this.labels = labels;
    this.selectedLabel = null;
    this.isOpen = false;
    this.onLabelSelect = null;
  }

  async load() {
    const response = await fetch('/views/sidebar/sidebar.html');
    const html = await response.text();
    const container = document.getElementById(this.containerId);
    if (container) {
      container.innerHTML = html;
      this.renderLabels();
      this.attachEventListeners();
    }
  }

  renderLabels() {
    const labelsList = document.getElementById('sidebar-labels');
    if (!labelsList) return;

    const activeClass = "bg-[#f8f8f9] text-[#343434] shadow-sm border border-gray-100 font-medium";
    const inactiveClass = "text-gray-600 hover:text-[#343434] hover:bg-gray-50 border border-transparent";
    const baseClass = "w-full text-left py-3 px-4 text-sm sm:text-base rounded-lg transition-all duration-200 hover:bg-[#f0f0f1] hover:shadow-sm active:scale-[0.98] min-h-[48px] flex items-center box-border";

    const labelsHTML = `
      <li>
        <button data-action="show-all" class="${baseClass} ${this.selectedLabel === null ? activeClass : inactiveClass}">
          <span>Show All</span>
        </button>
      </li>
      ${this.labels.map(label => `
        <li>
          <button data-action="select-label" data-label="${label.slug}" class="${baseClass} ${
            this.selectedLabel === label.slug ? activeClass : inactiveClass
          }">
            <span>${label.name}</span>
          </button>
        </li>
      `).join('')}
    `;

    labelsList.innerHTML = labelsHTML;
  }

  attachEventListeners() {
    const labelsList = document.getElementById('sidebar-labels');
    if (!labelsList) return;

    labelsList.addEventListener('click', (e) => {
      const button = e.target.closest('button');
      if (!button) return;

      const action = button.dataset.action;
      if (action === 'show-all') {
        this.selectLabel(null);
      } else if (action === 'select-label') {
        this.selectLabel(button.dataset.label);
      }
    });
  }

  selectLabel(labelSlug) {
    this.selectedLabel = labelSlug;
    this.renderLabels();
    if (this.onLabelSelect) {
      this.onLabelSelect(labelSlug);
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
