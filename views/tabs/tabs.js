export class Tabs {
  constructor(containerId) {
    this.containerId = containerId;
    this.activeTab = 'resources';
    this.onTabSwitch = null;
  }

  async load() {
    const response = await fetch('/views/tabs/tabs.html');
    const html = await response.text();
    const container = document.getElementById(this.containerId);
    if (container) {
      container.innerHTML = html;
      this.attachEventListeners();
      this.updateActiveTab();
    }
  }

  attachEventListeners() {
    const container = document.getElementById('tabs-container');
    if (!container) return;

    container.addEventListener('click', (e) => {
      const button = e.target.closest('[data-action="switch-tab"]');
      if (!button) return;

      const tab = button.dataset.tab;
      this.switchTab(tab);
    });
  }

  switchTab(tabKey) {
    if (tabKey === this.activeTab) return;
    this.activeTab = tabKey;
    this.updateActiveTab();
    if (this.onTabSwitch) {
      this.onTabSwitch(tabKey);
    }
  }

  updateActiveTab() {
    const buttons = document.querySelectorAll('[data-action="switch-tab"]');
    const activeClass = "bg-[#f8f8f9] text-[#343434] shadow-sm";
    const inactiveClass = "text-gray-600 hover:text-[#343434] hover:bg-gray-50 border border-transparent";

    buttons.forEach(button => {
      if (button.dataset.tab === this.activeTab) {
        button.className = `tab-button active px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg transition-colors duration-200 min-h-[44px] sm:min-h-[48px] flex items-center box-border ${activeClass}`;
      } else {
        button.className = `tab-button px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg transition-colors duration-200 min-h-[44px] sm:min-h-[48px] flex items-center box-border ${inactiveClass}`;
      }
    });
  }
}
